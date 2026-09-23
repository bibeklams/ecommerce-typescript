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

  const existingPayment = await prisma.payment.findFirst({
    where: {
      orderId: order.id,
      method,
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

export const updateSellerPaymentStatus = async (
  sellerId: number,
  paymentId: number,
  status: PaymentStatus,
) => {
  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId,
      order: {
        orderItems: {
          some: {
            product: {
              sellerId,
            },
          },
        },
      },
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
  data: {
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
  },
) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: { include: { product: { include: { inventory: true } } } },
    },
  });
  if (!cart) {
    throw createError(400, "Cart not found");
  }
  if (cart.items.length === 0) {
    throw createError(400, "Cart is empty");
  }
  /* * 2. Validate cart products and stock */ for (const item of cart.items) {
    if (item.product.deletedAt !== null) {
      throw createError(
        400,
        `Product ${item.productId} is no longer available`,
      );
    }
    if (item.quantity <= 0) {
      throw createError(400, `Invalid quantity for product ${item.productId}`);
    }
    if (!item.product.inventory) {
      throw createError(
        400,
        `Inventory not found for product ${item.productId}`,
      );
    }
    if (item.quantity > item.product.inventory.quantity) {
      throw createError(400, `Not enough stock for product ${item.productId}`);
    }
  }
  /* * 3. Calculate total */ const total = cart.items.reduce((sum, item) => {
    return sum + Number(item.product.price) * item.quantity;
  }, 0);
  /* * eSewa required charges. * We don't use tax/service/delivery charges currently. */ const amount =
    total;
  const taxAmount = 0;
  const serviceCharge = 0;
  const deliveryCharge = 0;
  const totalAmount = amount + taxAmount + serviceCharge + deliveryCharge;
  /* * 4. Create unique transaction UUID * * Only alphanumeric characters and hyphens. */ const transactionUuid = `ORDER-${Date.now()}-${userId}`;
  /* * 5. Create order + pending payment */ const result =
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          shippingName: data.shippingName,
          shippingPhone: data.shippingPhone,
          shippingAddress: data.shippingAddress,
          total: totalAmount,
          orderItems: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: Number(item.product.price),
              total: Number(item.product.price) * item.quantity,
            })),
          },
        },
      });
      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          amount: totalAmount,
          method: PaymentMethod.ESEWA,
          status: PaymentStatus.PENDING,
          refundStatus: RefundStatus.NONE,
          transactionUuid,
        },
      });
      return { order, payment };
    });
  /* * 6. eSewa UAT configuration */ const productCode =
    process.env.ESEWA_PRODUCT_CODE!;
  const secretKey = process.env.ESEWA_SECRET_KEY!;
  if (!productCode || !secretKey) {
    throw createError(500, "eSewa configuration is missing");
  }
  /* * 7. Fields required by eSewa for signing * * IMPORTANT: * The order must remain exactly: * * total_amount * transaction_uuid * product_code */ const signedFieldNames =
    "total_amount,transaction_uuid,product_code";
  const message =
    `total_amount=${totalAmount},` +
    `transaction_uuid=${transactionUuid},` +
    `product_code=${productCode}`;
  /* * 8. Generate HMAC-SHA256 signature */ const signature = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("base64");
  /* * 9. Return data required by frontend * * Frontend will POST these fields to eSewa. */ return {
    amount,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    transaction_uuid: transactionUuid,
    product_code: productCode,
    product_service_charge: serviceCharge,
    product_delivery_charge: deliveryCharge,
    success_url: `${process.env.ESEWA_SUCCESS_URL}`,
    failure_url: `${process.env.ESEWA_FAILURE_URL}`,
    signed_field_names: signedFieldNames,
    signature,
    orderId: result.order.id,
  };
};
