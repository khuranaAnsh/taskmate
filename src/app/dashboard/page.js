'use client';

import { Search, Settings, Calendar, ClipboardList, ListChecks, LayoutDashboard, Activity, Bell, Dropdown, Video, LogIn, Share2, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import NewTask from '@/app/components/newTask'
import NotificationPanel from '@/app/components/NotificationPanel';
import Link from 'next/link';

const TEAMS_MEETING_LINK = "https://teams.microsoft.com/l/meetup-join/your-meeting-id";

export default function Dashboard() {
    const [myTasks, setMyTasks] = useState([]);
    useEffect(() => {
        const fetchMyTasks = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/tasks/my-tasks", {
                    credentials: "include",
                    withCredentials: true
                });
                const data = await res.json();
                setMyTasks(data);
            } catch (err) {
                console.error("Error fetching user tasks:", err);
            }
        };

        fetchMyTasks();
    }, []);

    const [openTaskForm, setOpenTaskForm] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (item) => {
        setOpenDropdown(openDropdown === item ? null : item);
    };

    const Dropdown = ({ items }) => (
        <div className="ml-8 mt-2 space-y-1">
            {items.map((item, index) => (
                <div key={index} className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                    {item}
                </div>
            ))}
        </div>
    );

    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/auth/users/me', {
                    credentials: 'include',
                });
                const data = await res.json();
                setName(data.user.name);
                setRole(data.user.role); // Assuming the role is also returned in the response
            } catch (err) {
                console.error('Error fetching user:', err);
            }
        };
        fetchUser();
    }, []);

    const [ongoingTasks, setOngoingTasks] = useState([]);
    const [overdueTasks, setOverdueTasks] = useState([]);
    const [teamTasks, setTeamTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/tasks/all", {
                    credentials: "include",
                });
                const tasks = await res.json();
                const now = new Date();

                const filteredOngoing = tasks.filter(
                    (task) =>
                        task.status === "Todo" || task.status === "In Progress"
                );

                const filteredOverdue = tasks.filter((task) => {
                    const due = new Date(task.dueDate);
                    return due < now && task.status !== "Completed";
                });

                setOngoingTasks(filteredOngoing);
                setOverdueTasks(filteredOverdue);
                setTeamTasks(tasks.filter((task) => task.assignedTo)); // ✅ Only tasks with assigned users
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, []);

    console.log("Ongoing Tasks:", ongoingTasks);
    console.log("Overdue Tasks:", overdueTasks);
    console.log("Team Tasks:", teamTasks);

    const [copied, setCopied] = useState(false);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(TEAMS_MEETING_LINK);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };


    return (
        <div className="flex min-h-screen">

            {/* Sidebar - 25% */}
            <aside className="w-1/4  bg-[#D4D5EE]  px-6 py-8 space-y-8 shadow-sm">
                <div>
                    <h1 className="text-3xl  mx-4 font-bold  text-[#3667B1]">TaskMate</h1>
                    <p className="text-blue-800  font-semibold text-lg text-left mx-4 py-2">Your Professional Task Manager</p>
                </div>

                {/* Search */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full py-2 px-4 rounded-md border border-gray-800 focus:outline-blue-600 focus:border-none focus:placeholder:text-black"
                    />
                    <Search className="absolute top-2.5 right-3 h-5 w-5 text-gray-400 hover:text-black cursor-pointer" />
                </div>

                {/* Menu */}
                <nav className="space-y-6 ">
                    <div className="flex items-center gap-3 text-[#0b3676] border py-2 px-4 rounded-md text-lg font-semibold hover:text-blue-900 hover:bg-blue-100  hover:border-e-blue-950 cursor-pointer">
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Dashboard</span>
                    </div>

                    {/* My Tasks */}
                    <div>
                        <div className="flex items-center gap-3 text-[#0b3676] border py-2 px-4 rounded-md text-lg font-semibold hover:text-blue-900 hover:bg-blue-100  hover:border-e-blue-950 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <ListChecks className="w-5 h-5" />
                                <span>My Tasks</span>
                            </div>
                            <span onClick={() => toggleDropdown("tasks")} className="cursor-pointer">+</span>

                        </div>
                        {openDropdown === "tasks" && (
                            <div className="  text-lg py-2 border border-black mt-2 rounded-md bg-white shadow-md space-y-2 px-4">
                                <div className='flex justify-between '>
                                    <div
                                        onClick={() => setOpenTaskForm(true)}
                                        className="cursor-pointer hover:text-blue-600 transition-all"
                                    >
                                        Create a new task
                                    </div>

                                    <div className="cursor-pointer text-blue-600 hover:underline">
                                        <Link href="./managetask"> <Edit2 className="w-5 h-5" /> Manage tasks
                                        </Link>


                                    </div>
                                </div>



                                {myTasks.length > 0 ? (
                                    myTasks.map((task, idx) => (
                                        <div key={idx} className="text-gray-700">
                                            {task.title}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-500">No tasks
                                    </div>
                                )}
                            </div>
                        )}
                        <NewTask open={openTaskForm} setOpen={setOpenTaskForm} />
                        <div>


                        </div>
                    </div>

                    {/* Projects */}
                    <div>
                        <div className="flex items-center gap-3 text-[#0b3676] border py-2.5 px-4 rounded-md text-lg font-bold hover:text-blue-900 hover:bg-blue-100  hover:border-e-blue-950 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <ClipboardList className="w-5 h-5" />
                                <span>Projects</span>
                            </div>
                            <span onClick={() => toggleDropdown("projects")} className="cursor-pointer text-lg font-bold ">+</span>
                        </div>
                        {openDropdown === "projects" && (
                            <Dropdown items={["New Project", "Project Templates"]} />
                        )}
                    </div>

                    {/* Schedule */}
                    <div>
                        <div className="flex items-center gap-3 text-[#0b3676] border py-2 px-4 rounded-md text-lg font-semibold hover:text-blue-900 hover:bg-blue-100  hover:border-e-blue-950 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5" />
                                <span>Schedule</span>
                            </div>
                            <span onClick={() => toggleDropdown("schedule")} className="cursor-pointer">+</span>
                        </div>
                        {openDropdown === "schedule" && (
                            <Dropdown items={["Add Event", "View Calendar"]} />
                        )}
                    </div>

                    {/* Activities */}
                    <div>
                        <div className="flex items-center gap-3 text-[#0b3676] border py-2 px-4 rounded-md text-lg font-semibold hover:text-blue-900 hover:bg-blue-100  hover:border-e-blue-950 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Activity className="w-5 h-5" />
                                <span>Activities</span>
                            </div>
                            <span onClick={() => toggleDropdown("activities")} className="cursor-pointer">+</span>
                        </div>
                        {openDropdown === "activities" && (
                            <Dropdown items={["Log Activity", "Activity Report"]} />
                        )}
                    </div>

                    {/* Settings */}
                    <div className="flex items-center gap-3 text-[#0b3676] border py-2 px-4 rounded-md text-lg font-semibold hover:text-blue-900 hover:bg-blue-100  hover:border-e-blue-950 cursor-pointer">
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                    </div>
                </nav>
            </aside>

            {/* Main Content - 50% */}
            <main className="w-1/2 bg-purple-200 px-6 overflow-y-hidden ">
                <div className='flex items-center justify-between my-6'>
                    <div>
                        <h2 className="text-2xl font-semibold ">Hello <span className="font-bold capitalize">{name} , {role} </span></h2>
                        <p className="text-gray-500 ">Let&apos;s get things done!</p>
                    </div>

                    <div className='flex items-center justify-center gap-4'>
                        <div className="relative">
                            <input

                                placeholder="Search..."
                                className=" py-2 px-4 rounded-md border border-gray-300 focus:outline-none"
                            />
                            <Search className="absolute top-2.5 right-3  text-gray-400" />
                        </div>
                        <button
                            onClick={() => setOpenTaskForm(true)} className="bg-[#3667B1] text-white py-2 px-4 rounded-md hover:bg-purple-700 transition">+ New Task</button>
                        <NewTask open={openTaskForm} setOpen={setOpenTaskForm} userRole={role} />
                    </div>
                </div>


                {/* Stats */}
                <div className="grid grid-cols-3  gap-6 mb-4 mt-6">
                    {[
                        { label: 'Total Team Members', value: 10, icon: '👥' },
                        { label: 'Time Tracked', value: '20h 30m', icon: '⏰' },
                        { label: 'Tasks Completed', value: 8, icon: '✅' }
                    ].map(({ label, value, icon }) => (
                        <div key={label} className="bg-[#b9bbec]  rounded-xl p-4 shadow-xl  text-center">
                            <div className="text-2xl p-1">{icon}</div>
                            <div className="text-xl font-bold mt-2 p-1">{value}</div>
                            <div className="text-lg dont-semibold text-gray-500 p-1">{label}</div>
                        </div>
                    ))}
                </div>

                {/* Ongoing Tasks */}
                <div className="container mx-auto p-4 ">

                    <div className="flex items-start gap-6  ">
                        {/* Ongoing Tasks */}
                        <div className="flex flex-col w-1/2">
                            <h2 className="text-xl font-semibold mb-4 text-green-700">Ongoing Tasks</h2>
                            <div className="h-[350px] overflow-y-auto pr-2 ">
                                {ongoingTasks.length > 0 ? (
                                    <ul className="space-y-4">
                                        {ongoingTasks.map((task) => (
                                            <li
                                                key={task._id}
                                                className="bg-[#b9bbec] p-4 rounded-xl shadow-lg text-[#3667B1]"
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-semibold text-black">
                                                        Priority: {task.priority || "General"}
                                                    </span>
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                                        {task.status || "Ongoing"}
                                                    </span>
                                                </div>
                                                <h4 className="text-lg font-bold text-blue-950">{task.title}</h4>
                                                <p className="text-sm mt-1">{task.description}</p>
                                                <button className="mt-2 text-white underline">Details →</button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No ongoing tasks at the moment.</p>
                                )}
                            </div>
                        </div>

                        {/* Overdue Tasks */}
                        <div className="flex flex-col w-1/2">
                            <h2 className="text-xl font-semibold mb-4 text-red-700">Overdue Tasks</h2>
                            <div className="h-[350px] overflow-y-auto pr-2">
                                {overdueTasks.length > 0 ? (
                                    <ul className="space-y-4">
                                        {overdueTasks.map((task) => (
                                            <li
                                                key={task._id}
                                                className="bg-[#b9bbec] p-4 rounded-xl shadow-lg text-[#3667B1]"
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-semibold text-black">
                                                        Priority: {task.priority || "General"}
                                                    </span>
                                                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                                        {task.status || "Overdue"}
                                                    </span>
                                                </div>
                                                <h4 className="text-lg font-bold text-blue-950">{task.title}</h4>
                                                <p className="text-sm mt-1">{task.description}</p>
                                                <button className="mt-2 text-red-600 underline">Details →</button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No overdue tasks found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Tasks Assigned to Team */}
                    <h3 className="text-xl font-semibold pb-2">Tasks Assigned to Team</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                        {teamTasks.length > 0 ? (
                            teamTasks
                                .filter((task) => task.assignedTo) // ✅ Filter out tasks with no assigned user
                                .map((task) => (
                                    <div
                                        key={task._id}
                                        className="bg-[#b9bbec] p-4 rounded-xl shadow-sm border border-gray-200"
                                    >
                                        {/* ✅ Safely access assignedTo.name */}
                                        <div className="text-sm font-medium text-gray-500 mb-2">
                                            Assigned to: {task.assignedTo || "Unassigned"}
                                        </div>
                                        <h4 className="text-lg font-bold">{task.title}</h4>
                                        <p className="text-sm mt-1 text-gray-600">{task.description}</p>
                                        <button className="mt-2 text-purple-600 font-medium underline">
                                            Details →
                                        </button>
                                    </div>
                                ))
                        ) : (
                            <p>No tasks assigned to the team.</p>
                        )}
                    </div>

                </div>

            </main>




            {/* Right Panel - 25% */}
            <aside className="w-1/4 bg-[#D4D5EE]   p-6">
                <div className="flex text-2xl  text-[#3667B1] font-semibold mb-4 ">  <Bell className="w-5 h-5 mx-4 text-2xl  mt-2" />
                    Notifications
                </div>
                <NotificationPanel />

                <div className="mt-6">
                    <h3 className="font-bold text-xl text-center mb-6">Start a Teams Meeting</h3>
                    <div className="flex flex-col space-y-6 justify-center items-center">
                        <button

                            onClick={() => window.open("https://teams.microsoft.com/meeting", '_blank')}
                            className="bg-[#3667B1]  text-white font-semibold py-2.5 text-lg px-4  rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Video className="w-5 h-5" /> Start New Meeting
                        </button>

                        <button
                            onClick={() => window.open(TEAMS_MEETING_LINK, '_blank')}
                            className="bg-[#3667B1]  text-white font-semibold py-2.5 text-lg px-4  rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <LogIn className="w-5 h-5" /> Join a New Meeting
                        </button>

                        <button
                            onClick={handleCopyLink}
                            className="bg-[#3667B1]  text-white font-semibold py-2.5 text-lg px-4  rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Share2 className="w-5 h-5" /> {copied ? "Copied!" : "Share Meeting Link"}
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
}
