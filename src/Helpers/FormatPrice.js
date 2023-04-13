const FormatPrice = ({ price }) => {
  return Intl.NumberFormat("vie-IN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 2,
  }).format(price);
};

export default FormatPrice;
