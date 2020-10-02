import React from "react";

const Logo = () => (
    <h1 className="text-left mb-4 hidden justify-between items-center lg:flex">
        <span className="block text-2xl text-blue-600">Coursera Search</span>
        <a
            href="https://pkyriazo.github.io"
            title="Panagiotis Kyriazopoulos homepage"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center border-8 border-transparent w-20 h-20 rounded-full overflow-hidden hover:border-indigo-200"
        >
            <img
                src="https://avatars1.githubusercontent.com/u/25479457?s=460&u=7324d23b652ee6edec65add59033423fe21aacb7&v=4"
                alt="Panagiotis Kyriazopoulos"
            />
        </a>
    </h1>
);

export default Logo;
