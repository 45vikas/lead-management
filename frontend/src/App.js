import React, { useState, useEffect } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agents, setAgents] = useState([]);
  const [lists, setLists] = useState([]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [name, setName] = useState("");
  const [role, setRole] = useState("agent");

  const [editingLead, setEditingLead] = useState(null);

  const [agentForm, setAgentForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  // image uplaod state
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadMsg, setUploadMsg] = useState("");
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadImageFile = async () => {
    if (!image) return;

    const fd = new FormData();
    fd.append("image", image);

    try {
      const res = await fetch(API + "/api/images", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: fd,
      });

      const data = await res.json();
      setUploadMsg(data.message);

      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
    }
  };
  // LOGIN
  const login = async (e) => {
    e.preventDefault();

    const res = await fetch(API + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
    } else {
      setMessage(data.message);
    }
  };

  const fetchAgents = async (t) => {
    const res = await fetch(API + "/api/agents", {
      headers: { Authorization: "Bearer " + t },
    });
    const data = await res.json();
    if (res.ok) setAgents(data);
  };

  const fetchLists = async (t) => {
    const res = await fetch(API + "/api/upload", {
      headers: { Authorization: "Bearer " + t },
    });
    const data = await res.json();
    if (res.ok) setLists(data);
  };

  useEffect(() => {
    if (token) {
      fetchAgents(token);
      fetchLists(token);
    }
  }, [token]);

  // register
  const register = async (e) => {
    e.preventDefault();

    const res = await fetch(API + "/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        role, // admin or agent
      }),
    });

    const data = await res.json();
    setMessage(data.message);
  };
  // ADD AGENT
  const addAgent = async (e) => {
    e.preventDefault();

    const res = await fetch(API + "/api/agents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(agentForm),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Agent added ✅");
      setAgentForm({ name: "", email: "", mobile: "", password: "" });
      fetchAgents(token);
    } else {
      setMessage(data.message);
    }
  };

  // UPDATE LEAD
  const updateLead = async () => {
    try {
      const res = await fetch(
        `${API}/api/leads/${editingLead.listId}/${editingLead._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            firstName: editingLead.firstName,
            phone: editingLead.phone,
            status: editingLead.status,
          }),
        },
      );

      if (res.ok) {
        setEditingLead(null);
        fetchLists(token); // refresh UI
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteLead = async (lead) => {
    try {
      const res = await fetch(`${API}/api/leads/${lead.listId}/${lead._id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });

      const data = await res.json();
      console.log("DELETE:", data);

      fetchLists(token);
    } catch (err) {
      console.error(err);
    }
  };

  // UPLOAD CSV
  const handleUpload = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(API + "/api/upload", {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: fd,
    });

    const data = await res.json();
    setMessage(data.message);
    fetchLists(token);
  };

  // FLATTEN LEADS
  const allLeads = lists.flatMap((l) =>
    l.items.map((item) => ({
      ...item,
      listId: l._id, // 🔥 IMPORTANT
    })),
  );

  // SEARCH
  const filteredLeads = allLeads.filter(
    (it) =>
      it.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      it.phone?.includes(search),
  );

  // PAGINATION
  const perPage = 5;
  const totalPages = Math.ceil(filteredLeads.length / perPage);

  const paginatedLeads = filteredLeads.slice(
    (page - 1) * perPage,
    page * perPage,
  );
  // image upload function
  // const uploadImage = async () => {
  //   const fd = new FormData();
  //   fd.append("image", file);

  //   const res = await fetch(API + "/api/images", {
  //     method: "POST",
  //     headers: {
  //       Authorization: "Bearer " + token,
  //     },
  //     body: fd,
  //   });

  //   const data = await res.json();
  //   console.log(data);
  // };

  return (
    <div className="min-h-screen bg-gray-100">
      {!token ? (
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-3xl font-bold text-center mb-4">Admin Login</h2>

            <form onSubmit={login} className="space-y-3">
              <input
                className="w-full border p-3 rounded-lg"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                className="w-full border p-3 rounded-lg"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
                Login
              </button>
              {/* 🔥 REGISTER SECTION */}
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold text-center mb-2">
                  New User? Register
                </h3>

                <form onSubmit={register} className="space-y-2">
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                  />

                  <input
                    className="w-full border p-2 rounded"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <input
                    type="password"
                    className="w-full border p-2 rounded"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <select
                    className="w-full border p-2 rounded"
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>

                  <button className="w-full bg-green-600 text-white py-2 rounded">
                    Register
                  </button>
                </form>
              </div>
            </form>

            <p className="text-center mt-2 text-red-500">{message}</p>
          </div>
        </div>
      ) : (
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-blue-800 text-white p-6">
            <h1 className="text-2xl font-bold mb-6">Lead Dashboard</h1>
          </div>

          <div className="flex-1 p-6">
            {/* HEADER */}
            <div className="flex justify-between mb-6">
              <h2 className="text-3xl font-bold">Dashboard</h2>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  setToken("");
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </div>

            {/* ADD AGENT */}
            <div className="bg-white p-5 rounded-xl shadow mb-6">
              <h3 className="font-semibold mb-3">Add Leads</h3>

              <form onSubmit={addAgent} className="grid grid-cols-4 gap-3">
                <input
                  className="border p-2 rounded"
                  placeholder="Name"
                  value={agentForm.name}
                  onChange={(e) =>
                    setAgentForm({ ...agentForm, name: e.target.value })
                  }
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Email"
                  value={agentForm.email}
                  onChange={(e) =>
                    setAgentForm({ ...agentForm, email: e.target.value })
                  }
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Mobile"
                  value={agentForm.mobile}
                  onChange={(e) =>
                    setAgentForm({ ...agentForm, mobile: e.target.value })
                  }
                />
                <input
                  type="password"
                  className="border p-2 rounded"
                  placeholder="Password"
                  value={agentForm.password}
                  onChange={(e) =>
                    setAgentForm({ ...agentForm, password: e.target.value })
                  }
                />

                <button className="col-span-4 bg-blue-600 text-white py-2 rounded-lg">
                  Add
                </button>
              </form>
            </div>

            {/* SEARCH */}
            <input
              className="border p-3 rounded-lg w-full mb-4"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />

            <button onClick={uploadImageFile}>Upload Image</button>
            {/* TABLE */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3">Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedLeads.map((it, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-3">
                        {editingLead?._id === it._id ? (
                          <input
                            value={editingLead.firstName}
                            onChange={(e) =>
                              setEditingLead({
                                ...editingLead,
                                firstName: e.target.value,
                              })
                            }
                          />
                        ) : (
                          it.firstName
                        )}
                      </td>

                      <td>{it.email || "N/A"}</td>

                      <td>{it.phone}</td>

                      <td>
                        {editingLead?._id === it._id ? (
                          <select
                            value={editingLead.status || "New"}
                            onChange={(e) =>
                              setEditingLead({
                                ...editingLead,
                                status: e.target.value,
                              })
                            }
                          >
                            <option>New</option>
                            <option>Contacted</option>
                            <option>Converted</option>
                          </select>
                        ) : (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {it.status || "New"}
                          </span>
                        )}
                      </td>

                      <td>
                        {editingLead?._id === it._id ? (
                          <>
                            <button
                              onClick={updateLead}
                              className="text-green-600 mr-2"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingLead(null)}
                              className="text-red-500"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingLead({ ...it })}
                              className="text-blue-600 mr-3"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => deleteLead(it)}
                              className="text-red-600"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Prev
              </button>

              <span className="px-4 py-2 bg-white shadow rounded-lg">
                {page} / {totalPages || 1}
              </span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
