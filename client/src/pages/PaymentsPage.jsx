import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { CreditCard } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import paymentService from "../services/paymentService";
import { formatCurrency, formatDate } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";

const PaymentsPage = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentService
      .getPaymentHistory()
      .then((data) => setPayments(data.payments))
      .catch(() => toast.error("Failed to load payment history"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-bold text-ink mb-8">Payment History</h1>

      {payments.length === 0 ? (
        <EmptyState icon={CreditCard} title="No payments yet" description="Your transaction history will appear here." />
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-nude/20 text-left">
              <tr>
                <th className="p-4 font-heading font-semibold text-ink">Job</th>
                <th className="p-4 font-heading font-semibold text-ink">
                  {user.role === "client" ? "Freelancer" : "Client"}
                </th>
                <th className="p-4 font-heading font-semibold text-ink">Amount</th>
                <th className="p-4 font-heading font-semibold text-ink">Status</th>
                <th className="p-4 font-heading font-semibold text-ink">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-t border-mocha/10">
                  <td className="p-4 text-ink/70">{p.job?.title || "—"}</td>
                  <td className="p-4 text-ink/70">
                    {user.role === "client" ? p.freelancer?.name : p.user?.name}
                  </td>
                  <td className="p-4 font-heading font-semibold text-mocha">
                    {formatCurrency(p.amount)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full capitalize ${
                        p.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : p.status === "pending"
                          ? "bg-nude/40 text-mocha-dark"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-ink/50">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PaymentsPage;
