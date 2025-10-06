import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ items = [] }) => {
  return (
    <div className="flex items-center text-xs gap-1 text-[#6C6C6C]">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {item.path && !isLast ? (
              <Link
                to={item.path}
                className="hover:text-[#F77F00] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <p className={isLast ? "text-[#F77F00]" : ""}>{item.label}</p>
            )}

            {!isLast && (
              <span className="mx-1 text-[#9A9A9A]">/</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
