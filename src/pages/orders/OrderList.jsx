import Layout from "../../components/Layout/Layout";
import OrdersListComponent from "../../components/orders/OrdersListComponent";

export default function OrderList() {
  return (
    <Layout>
      <div className="container mt-2">
        <OrdersListComponent />
      </div>
    </Layout>
  );
}
