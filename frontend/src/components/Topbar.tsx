import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

export const Topbar = () => {
  return (
    <div className="max-w-screen-lg w-full bg-black align-center p-5">
      <img src="/logo.png" className="max-w-40" />
      <Navbar />
    </div>
  );
};

const topbarItems = [
  {
    title: "About",
    route: "/about",
  },
  {
    title: "Activity",
    route: "/activity",
  },
  {
    title: "Problems",
    route: "/problems",
  },
  {
    title: "Leaderboard",
    route: "/leaderboard",
  },
];
function Navbar() {
  return (
    <div className="flex">
      {topbarItems.map((item) => (
        <NavbarItem route={item.route} title={item.title} />
      ))}
    </div>
  );
}

function NavbarItem({ title, route }: { title: string; route: string }) {
  return (
    <Link to={route}>
      <div className="mx-10 text-slate-500 text-lg cursor-pointer hover:text-white font-light">
        {title}
      </div>
    </Link >
  );
}
