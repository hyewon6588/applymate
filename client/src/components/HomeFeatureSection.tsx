"use client";

export default function HomeFeatureSection() {
  const features = [
    {
      icon: "🔄",
      title: "Auto-Save Progress",
      description:
        "Your application edits are automatically saved as you type—no need to press save.",
    },
    {
      icon: "🧠",
      title: "Match & Feedback",
      description:
        "Get instant match score and keyword suggestions for better results.",
    },
    {
      icon: "📊",
      title: "Application Tracker",
      description:
        "Track all your job applications in one clean and organized place.",
    },
  ];

  return (
    <section
      id="feature-section"
      className="flex flex-col items-center justify-center min-h-screen px-6 py-24 bg-gray-50 text-center"
    >
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-slate-900">
          Why Use ApplyMate?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
