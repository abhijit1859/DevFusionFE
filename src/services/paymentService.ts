export const createOrder = async (amount: number) => {
  const res = await fetch("http://localhost:3001/v1/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ amount }),
  });

  return res.json();
};

export const verifyPayment = async (payload: any) => {
  const res = await fetch("http://localhost:3001/v1/verify-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return res.json();
};