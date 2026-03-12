import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { TrendingUp, ShoppingCart } from "lucide-react";
import TransactionDetailModal from "@/components/modals/TransactionDetailModal";
import type { Transaction } from "@/context/AppContext";

const CHART_FILTERS = ["1W", "1M", "3M"];

export default function Dashboard() {
  const { transactions } = useApp();
  const navigate = useNavigate();
  const [chartFilter, setChartFilter] = useState("1W");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const todaySales = transactions.reduce((s, t) => s + t.total, 0);

  return (
    <div className="p-4 space-y-5 max-w-2xl mx-auto">
      {/* Today's Overview */}
      <section>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Today's Overview</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-4 card-shadow">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp size={16} />
              <span className="text-xs font-medium">Today's Sales</span>
            </div>
            <p className="text-2xl font-bold font-mono text-foreground">₹{todaySales.toLocaleString()}</p>
          </div>
          <div className="bg-card rounded-xl p-4 card-shadow">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <ShoppingCart size={16} />
              <span className="text-xs font-medium">Transactions</span>
            </div>
            <p className="text-2xl font-bold font-mono text-foreground">{transactions.length}</p>
          </div>
        </div>
      </section>

      {/* Sales Chart */}
      <section>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Sales Chart</h3>
        <div className="bg-card rounded-xl p-4 card-shadow">
          <div className="flex gap-2 mb-4">
            {CHART_FILTERS.map(f => (
              <button key={f} onClick={() => setChartFilter(f)} className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${chartFilter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{f}</button>
            ))}
          </div>
          {/* Dynamic chart based on filter */}
          <div className="h-40 flex items-end gap-1">
            {(chartFilter === "1W" 
              ? [45, 60, 55, 70, 65, 80, 75] 
              : chartFilter === "1M"
              ? [40, 55, 50, 65, 60, 75, 70, 85, 80, 90, 85, 95]
              : [35, 50, 40, 65, 55, 80, 70, 90, 75, 95, 85, 100]
            ).map((h, i) => (
              <div key={i} className="flex-1 bg-primary/20 rounded-t-sm relative group cursor-pointer hover:bg-primary/40 transition-colors" style={{ height: `${h}%` }}>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">₹{(h * 50)}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-mono">
            {chartFilter === "1W" ? (
              <><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></>
            ) : chartFilter === "1M" ? (
              <><span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>W1</span><span>W2</span><span>W3</span><span>W4</span></>
            ) : (
              <><span>W1</span><span>W4</span><span>W8</span><span>W12</span></>
            )}
          </div>
        </div>
      </section>

      {/* Recent Transactions */}
      <section>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Recent Transactions</h3>
        <div className="bg-card rounded-xl card-shadow divide-y divide-border">
          {transactions.slice(0, 4).map(tx => (
            <button key={tx.id} onClick={() => setSelectedTx(tx)} className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left">
              <div>
                <p className="text-sm font-medium text-foreground">{tx.customer}</p>
                <p className="text-xs text-muted-foreground">{tx.time}</p>
              </div>
              <span className="text-sm font-semibold font-mono text-foreground">₹{tx.total.toLocaleString()}</span>
            </button>
          ))}
        </div>
        <button onClick={() => navigate("/transactions")} className="mt-3 text-sm text-primary font-medium hover:underline">View All Transactions →</button>
      </section>

      <TransactionDetailModal transaction={selectedTx} onClose={() => setSelectedTx(null)} />
    </div>
  );
}
