import type { Cart, CartItem } from "@/types";

const DEFAULT_UID = "1";
const KEY_PREFIX = "cart"; // final key: cart:1

function storageKey(uid: string = DEFAULT_UID) {
  return `${KEY_PREFIX}:${uid}`;
}

function safeParse<T>(v: string | null): T | null {
  if (!v) return null;
  try {
    return JSON.parse(v) as T;
  } catch {
    return null;
  }
}

export function readCart(uid: string = DEFAULT_UID): Cart {
  if (typeof window === "undefined") {
    return { uid, items: [], totalPrice: 0, totalQuantity: 0 };
  }
  const raw = localStorage.getItem(storageKey(uid));
  const c = safeParse<Cart>(raw);
  return c ?? { uid, items: [], totalPrice: 0, totalQuantity: 0 };
}

function calcTotals(items: CartItem[]) {
  const totalQuantity = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => {
    // product.price may exist if the SDK attached product info
    const price = i.product?.price ?? 0;
    return s + price * i.quantity;
  }, 0);
  return { totalQuantity, totalPrice };
}

export function writeCart(cart: Cart) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    storageKey(cart.uid ?? DEFAULT_UID),
    JSON.stringify(cart)
  );
}

export function addItem(uid: string = DEFAULT_UID, item: CartItem) {
  const cart = readCart(uid);
  const exist = cart.items.find((i) => i.skuId === item.skuId);
  if (exist) exist.quantity += item.quantity;
  else cart.items.push(item);
  const totals = calcTotals(cart.items);
  cart.totalPrice = totals.totalPrice;
  cart.totalQuantity = totals.totalQuantity;
  writeCart(cart);
  return cart;
}

export function updateItem(
  uid: string = DEFAULT_UID,
  skuId: string,
  quantity: number
) {
  const cart = readCart(uid);
  const it = cart.items.find((i) => i.skuId === skuId);
  if (!it) throw new Error("Item not found");
  it.quantity = quantity;
  const totals = calcTotals(cart.items);
  cart.totalPrice = totals.totalPrice;
  cart.totalQuantity = totals.totalQuantity;
  writeCart(cart);
  return cart;
}

export function removeItem(uid: string = DEFAULT_UID, skuId: string) {
  const cart = readCart(uid);
  cart.items = cart.items.filter((i) => i.skuId !== skuId);
  const totals = calcTotals(cart.items);
  cart.totalPrice = totals.totalPrice;
  cart.totalQuantity = totals.totalQuantity;
  writeCart(cart);
  return cart;
}

export const clientCart = {
  readCart,
  writeCart,
  addItem,
  updateItem,
  removeItem,
};

export default clientCart;
