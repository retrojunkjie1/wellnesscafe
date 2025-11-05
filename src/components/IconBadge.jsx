import React from "react";

const sizeToClass = (size)=>{
  switch(size){
    case "xs": return "wellness-icon-xs";
    case "sm": return "wellness-icon-sm";
    case "md": return "wellness-icon-md";
    case "lg": return "wellness-icon-lg";
    case "xl": return "wellness-icon-xl";
    default: return "wellness-icon-sm";
  }
};

const IconBadge = ({children, size="sm", title, ariaLabel, className=""})=>{return (
  <span
    className={`wellness-icon wellness-icon-card ${sizeToClass(size)} ${className}`}
    title={title}
    aria-label={ariaLabel}
    role={ariaLabel?"img":undefined}
  >
    {children}
  </span>
);} ;

export default IconBadge;
