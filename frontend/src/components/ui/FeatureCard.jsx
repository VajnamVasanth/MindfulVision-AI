function FeatureCard({ title, description, icon: Icon }) {
  return (
    <div className="p-6 rounded-lg border bg-card transition-all hover:shadow-lg hover:scale-105">
      <div className="flex items-center gap-4 mb-4">
        {Icon && <Icon className="w-6 h-6 text-primary" />}
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-card-foreground">{description}</p>
    </div>
  );
}

export default FeatureCard;
