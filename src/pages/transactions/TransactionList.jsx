import Layout from "../../components/Layout/Layout";
import TransactionsListComponent from "../../components/transactions/TransactionsListComponent";
import TransactionsStats from "../../components/transactions/TransactionsStats";

export default function TransactionList() {
  return (
    <Layout>
      <div className="container mt-2">
        <TransactionsListComponent />
        <hr className="my-5" />
        <TransactionsStats />
      </div>
    </Layout>
  );
}
