import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";

function Home() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const result = await axios.get("/view_tasks");
    setTasks(result.data.tasks);
  };

  const deleteTask = async (id) => {
    await axios.delete(`/delete_task/${id}`);
    loadTasks();
  };

  const columns = [
    {
      name: "Task Name",
      selector: (row) => row.taskName,
      sortable: true,
    },
    {
      name: "Task Description",
      selector: (row) => row.taskDescription,
      sortable: true,
    },
    {
      name: "Added Date",
      selector: (row) => row.addedDate,
      sortable: true,
    },
    {
      name: "Due Date",
      selector: (row) => row.dueDate,
      sortable: true,
    },
    {
      name: "Priority",
      sortable: true,
      selector: (row) => row.priority,
    },
    {
      name: "Task Status",
      sortable: true,
      selector: (row) => (
        <div>
          {row.taskStatus === "Completed" && (
            <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
              {row.taskStatus}
            </span>
          )}

          {row.taskStatus === "Pending" && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
              {row.taskStatus}
            </span>
          )}
        </div>
      ),
    },
    {
      name: "Action",
      width: "180px",
      selector: (row) => (
        <div>
          <Link
            to={`/update_task/${row._id}`}
            type="button"
            className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 font-medium rounded-lg px-2.5 py-1.5 text-sm text-center mr-2 mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400"
          >
            Update
          </Link>

          <button
            type="button"
            onClick={() => deleteTask(row._id)}
            className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 font-medium rounded-lg px-2.5 py-1.5 text-sm text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const [searchText, setSearchText] = useState("");

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = tasks.filter(
    (item) =>
      item.taskName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.taskDescription.toLowerCase().includes(searchText.toLowerCase()) ||
      item.addedDate.toLowerCase().includes(searchText.toLowerCase()) ||
      item.dueDate.toLowerCase().includes(searchText.toLowerCase()) ||
      item.priority.toLowerCase().includes(searchText.toLowerCase()) ||
      item.taskStatus.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <NavBar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a
                  href="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  Home
                </a>
              </li>
            </ol>
          </nav>
          <h2 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-gray-700">
            List of Tasks
          </h2>
          <br />

          <DataTable
            columns={columns}
            data={filteredData}
            fixedHeader
            responsive
            highlightOnHover
            pagination
            subHeader
            subHeaderComponent={
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    value={searchText}
                    onChange={handleSearch}
                    type="search"
                    id="search"
                    className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-500 dark:text-gray-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search"
                  />
                </div>
              </div>
            }
          ></DataTable>
        </div>
      </div>
    </div>
  );
}

export default Home;
