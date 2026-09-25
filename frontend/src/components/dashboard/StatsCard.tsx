type Props = {
  label: string;
  value: number;
  icon: string;
  variant?: "available" | "borrowed";
};

// Responsabilidad: mostrar una tarjeta de estadistica.
// Recibe datos por props para no depender de donde se calculan esos valores.
function StatsCard({ label, value, icon, variant }: Props) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${variant ?? ""}`}>
        <i className={icon}></i>
      </div>

      <div>
        <span className="stat-label">{label}</span>

        <h2>{value}</h2>
      </div>
    </div>
  );
}

export default StatsCard;
