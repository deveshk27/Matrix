export const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full p-6 text-left bg-white border border-gray-200 rounded-lg shadow-sm">
      {children}
    </div>
  );
};
