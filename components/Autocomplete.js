import React, { useEffect, useState } from "react";
import Tag from "./Tag";

const Autocomplete = ({ options, values, setValues }) => {
  const [isEditable, setIsEditable] = useState(false);

  if (true) {
    return (
      <>
        <div className="container">
          <input type="text" onBlur={() => setIsEditable(false)} autoFocus placeholder="Search..."/>
        </div>
        <style jsx>{`
          .container {
            display: inline-flex;
            max-width: 180px;
          }

          .container > input {
            width: 100%;
            height: 28px;
            border-radius: 4px;
            border: none;
            padding: 2px 8px;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <div className="autocomplete" onClick={() => setIsEditable(true)}>
        {!!values?.length
          ? values.map((value) => <Tag key={value}>{value}</Tag>)
          : "Search..."}
      </div>
      <style jsx>{`
        .autocomplete {
          display: inline-flex;
          align-items: center;
          background: #fff;
          border-radius: 4px;
          padding: 5px 8px;
          min-width: 180px;
          color: #2d0612;
          height: 28px;
        }
      `}</style>
    </>
  );
};

export default Autocomplete;
{
}
