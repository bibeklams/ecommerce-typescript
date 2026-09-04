import prisma from "../config/prisma.js";
import createError from "http-errors";
import { PaymentMethod } from "../generated/prisma/client.js";
import { PaymentStatus } from "../generated/prisma/client.js";
import { RefundStatus } from "../generated/prisma/client.js";
import crypto from "crypto";

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

  const payment = await prisma.payment.findUnique({
    where: {
      orderId: order.id,
    },
  });

  if (payment) {
    throw createError(400, "Payment already exists for this order");
  }

  const newPayment = await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: order.total,
      method,
    },
  });

  return newPayment;
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

  if (payment.status !== "PAID") {
    throw createError(400, "Only paid payments can be refunded");
  }

  if (payment.refundStatus !== "NONE") {
    throw createError(400, "Refund request already exists");
  }

  const updatedPayment = await prisma.payment.update({
    where: {
      id: paymentId,
    },
    data: {
      refundStatus: "REQUESTED",
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

  if (payment.refundStatus !== "REQUESTED") {
    throw createError(400, "No refund request is pending");
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
  page: number = 1,
  limit: number = 20,
) => {
  const skip = (page - 1) * limit;

  const payments = await prisma.payment.findMany({
    where: {
      order: {
        shippingName: {
          contains: search,
          mode: "insensitive",
        },
      },
    },
    include: {
      order: true,
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalPayments = await prisma.payment.count({
    where: {
      order: {
        shippingName: {
          contains: search,
          mode: "insensitive",
        },
      },
    },
  });

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

  const transactionUuid = `order-${order.id}-${Date.now()}`;

  const totalAmount = Number(order.total);

  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`;

  const signature = crypto
    .createHmac("sha256", process.env.ESEWA_SECRET_KEY!)
    .update(message)
    .digest("base64");

  return {
    amount: totalAmount,
    tax_amount: 0,
    total_amount: totalAmount,
    transaction_uuid: transactionUuid,
    product_code: process.env.ESEWA_PRODUCT_CODE,
    product_service_charge: 0,
    product_delivery_charge: 0,
    success_url: process.env.ESEWA_SUCCESS_URL,
    failure_url: process.env.ESEWA_FAILURE_URL,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature,
  };
};
