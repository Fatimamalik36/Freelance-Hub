import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { CreditCard, Lock, CheckCircle2 } from "lucide-react";
import MainLayout from "../layout/MainLayout";
import Loader from "../components/Loader";
import jobService from "../services/jobService";
import paymentService from "../services/paymentService";
import { formatCurrency } from "../utils/helpers";

const PaymentPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });

  useEffect(() => {
    jobService
      .getJobById(jobId)
      .then((data) => setJob(data.job))
      .catch(() => {
        toast.error("Job not found");
        navigate("/dashboard");
      })
      .finally(() => setLoading(false));
  }, [jobId, navigate]);

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const { payment } = await paymentService.createPayment(jobId, job.budget);
      // Simulate gateway processing delay, then confirm (mock Stripe flow)
      await new Promise((r) => setTimeout(r, 1200));
      await paymentService.confirmPayment(payment._id);
      setSuccess(true);
      toast.success("Payment successful!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!job) return null;

  if (success) {
    return (
      <MainLayout>
        <section className="bg-hero-gradient py-24">
          <div className="section-container max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-10 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={30} className="text-green-600" />
              </div>
              <h1 className="font-heading font-bold text-xl text-ink mb-2">Payment Successful!</h1>
              <p className="text-sm text-ink/60 mb-6">
                {formatCurrency(job.budget)} has been sent for "{job.title}".
              </p>
              <button onClick={() => navigate("/dashboard/payments")} className="btn-primary w-full">
                View Payment History
              </button>
            </motion.div>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="bg-hero-gradient py-16">
        <div className="section-container max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-nude/40 flex items-center justify-center">
                <CreditCard size={22} className="text-mocha" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-lg text-ink">Complete Payment</h1>
                <p className="text-xs text-ink/50">Secure checkout for "{job.title}"</p>
              </div>
            </div>

            <div className="bg-nude/20 rounded-2xl p-4 mb-6 flex items-center justify-between">
              <span className="text-sm text-ink/60">Amount Due</span>
              <span className="font-display text-2xl font-bold text-mocha">
                {formatCurrency(job.budget)}
              </span>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              <input
                required
                placeholder="Cardholder Name"
                value={card.name}
                onChange={(e) => setCard({ ...card, name: e.target.value })}
                className="input-field"
              />
              <input
                required
                placeholder="Card Number"
                maxLength={19}
                value={card.number}
                onChange={(e) => setCard({ ...card, number: e.target.value })}
                className="input-field"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  placeholder="MM/YY"
                  maxLength={5}
                  value={card.expiry}
                  onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                  className="input-field"
                />
                <input
                  required
                  placeholder="CVC"
                  maxLength={4}
                  value={card.cvc}
                  onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                  className="input-field"
                />
              </div>

              <button type="submit" disabled={processing} className="btn-primary w-full">
                {processing ? "Processing..." : `Pay ${formatCurrency(job.budget)}`} <Lock size={15} />
              </button>
              <p className="text-xs text-center text-ink/40">
                🔒 This is a demo checkout. No real charges are made. Wire up a real Stripe
                PaymentIntent server-side to go live.
              </p>
            </form>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default PaymentPage;
