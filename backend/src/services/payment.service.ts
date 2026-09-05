import prisma from "../config/prisma.js";
import createError from "http-errors";
import crypto from "crypto";

import {
  PaymentMethod,
  PaymentStatus,
  RefundStatus,
} from "../generated/prisma/client.js";

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

export const initiateEsewaPayment = async (userId: number, orderId: number) => {
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

  if (payment.method !== PaymentMethod.ESEWA) {
    throw createError(400, "This order is not using eSewa payment");
  }

  if (payment.status === PaymentStatus.PAID) {
    throw createError(400, "Payment is already completed");
  }

  if (payment.status === PaymentStatus.REFUNDED) {
    throw createError(400, "Payment has already been refunded");
  }

  const transactionUuid = `order-${order.id}-${Date.now()}`;

  const totalAmount = Number(order.total);

  const productCode = process.env.ESEWA_PRODUCT_CODE;
  const secretKey = process.env.ESEWA_SECRET_KEY;

  if (!productCode || !secretKey) {
    throw createError(500, "eSewa configuration is missing");
  }

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
    success_url: process.env.ESEWA_SUCCESS_URL,
    failure_url: process.env.ESEWA_FAILURE_URL,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature,
  };
};
