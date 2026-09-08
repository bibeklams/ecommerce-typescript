import prisma from "../config/prisma.js";
import createError from "http-errors";
import crypto from "crypto";

import {
  PaymentMethod,
  PaymentStatus,
  RefundStatus,
} from "../generated/prisma/client.js";
interface EsewaCheckoutData {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
}
export const createPayment = async (
  userId: number,
  orderId: number,
  method: PaymentMethod,
) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
      deletedAt: null,
    },
  });

  if (!order) {
    throw createError(404, "Order not found");
  }

  const existingPayment = await prisma.payment.findUnique({
    where: {
      orderId: order.id,
    },
  });

  if (existingPayment) {
    throw createError(400, "Payment already exists for this order");
  }

  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: order.total,
      method,
      status: PaymentStatus.PENDING,
      refundStatus: RefundStatus.NONE,
    },
  });

  return payment;
};

export const getMyPayment = async (userId: number, orderId: number) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
      deletedAt: null,
    },
  });

  if (!order) {
    throw createError(404, "Order not found");
  }

  const payment = await prisma.payment.findUnique({
    where: {
      orderId: order.id,
    },
  });

  if (!payment) {
    throw createError(404, "Payment not found");
  }

  return payment;
};

export const updatePaymentStatus = async (
  paymentId: number,
  status: PaymentStatus,
) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
  });

  if (!payment) {
    throw createError(404, "Payment not found");
  }

  if (payment.status === PaymentStatus.PAID) {
    throw createError(400, "Payment is already paid");
  }

  if (payment.status === PaymentStatus.REFUNDED) {
    throw createError(400, "Refunded payment cannot be changed");
  }

  const allowedStatuses: PaymentStatus[] = [
    PaymentStatus.PAID,
    PaymentStatus.FAILED,
  ];

  if (!allowedStatuses.includes(status)) {
    throw createError(400, "Invalid payment status");
  }

  const updatedPayment = await prisma.payment.update({
    where: {
      id: paymentId,
    },
    data: {
      status,
    },
  });

  return updatedPayment;
};

export const requestRefund = async (userId: number, paymentId: number) => {
  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId,
      order: {
        userId,
        deletedAt: null,
      },
    },
  });

  if (!payment) {
    throw createError(404, "Payment not found");
  }

  if (payment.status !== PaymentStatus.PAID) {
    throw createError(400, "Only paid payments can be refunded");
  }

  if (payment.refundStatus !== RefundStatus.NONE) {
    throw createError(400, "Refund request already exists");
  }

  const updatedPayment = await prisma.payment.update({
    where: {
      id: paymentId,
    },
    data: {
      refundStatus: RefundStatus.REQUESTED,
    },
  });

  return updatedPayment;
};

export const updateRefundStatus = async (
  paymentId: number,
  status: RefundStatus,
) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
  });

  if (!payment) {
    throw createError(404, "Payment not found");
  }

  if (payment.refundStatus !== RefundStatus.REQUESTED) {
    throw createError(400, "No refund request is pending");
  }

  const allowedStatuses: RefundStatus[] = [
    RefundStatus.APPROVED,
    RefundStatus.REJECTED,
  ];

  if (!allowedStatuses.includes(status)) {
    throw createError(400, "Invalid refund status");
  }

  const updatedPayment = await prisma.payment.update({
    where: {
      id: paymentId,
    },
    data: {
      refundStatus: status,
    },
  });

  return updatedPayment;
};
export const getAllPayments = async (
  search: string = "",
  status?: PaymentStatus,
  page: number = 1,
  limit: number = 20,
) => {
  page = Math.max(1, page);
  limit = Math.min(Math.max(1, limit), 100);

  const skip = (page - 1) * limit;

  const where = {
    order: {
      shippingName: {
        contains: search,
        mode: "insensitive" as const,
      },
    },

    ...(status && {
      status,
    }),
  };

  const [payments, totalPayments] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: {
        order: true,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.payment.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(totalPayments / limit);

  return {
    payments,
    page,
    limit,
    totalPayments,
    totalPages,
  };
};

export const initiateEsewaPayment = async (
  userId: number,
  data: EsewaCheckoutData,
) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              inventory: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    throw createError(400, "No cart found");
  }

  if (cart.items.length === 0) {
    throw createError(400, "Cart is empty");
  }

  // Validate cart before sending the customer to eSewa
  for (const item of cart.items) {
    if (item.product.deletedAt !== null) {
      throw createError(
        400,
        `Product ${item.productId} is no longer available`,
      );
    }

    if (item.quantity <= 0) {
      throw createError(400, `Invalid quantity for product ${item.productId}`);
    }

    if (
      item.product.inventory &&
      item.quantity > item.product.inventory.quantity
    ) {
      throw createError(400, `Not enough stock for product ${item.productId}`);
    }
  }

  const totalAmount = cart.items.reduce((sum, item) => {
    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  const productCode = process.env.ESEWA_PRODUCT_CODE;
  const secretKey = process.env.ESEWA_SECRET_KEY;
  const successUrl = process.env.ESEWA_SUCCESS_URL;
  const failureUrl = process.env.ESEWA_FAILURE_URL;

  if (!productCode || !secretKey || !successUrl || !failureUrl) {
    throw createError(500, "eSewa configuration is missing");
  }

  const transactionUuid = `cart-${userId}-${Date.now()}`;

  const message =
    `total_amount=${totalAmount},` +
    `transaction_uuid=${transactionUuid},` +
    `product_code=${productCode}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("base64");

  return {
    amount: totalAmount,
    tax_amount: 0,
    total_amount: totalAmount,
    transaction_uuid: transactionUuid,
    product_code: productCode,
    product_service_charge: 0,
    product_delivery_charge: 0,
    success_url: successUrl,
    failure_url: failureUrl,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature,

    // You need these after eSewa returns
    shippingName: data.shippingName,
    shippingPhone: data.shippingPhone,
    shippingAddress: data.shippingAddress,
  };
};
