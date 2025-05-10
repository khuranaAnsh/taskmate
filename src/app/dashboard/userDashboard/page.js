'use client';

import { Search, Settings, Calendar, ClipboardList, ListChecks, LayoutDashboard, Activity, Bell, Dropdown , Video ,LogIn,Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import NewTask from '@/app/components/newTask'
import NotificationPanel from '@/app/components/NotificationPanel';
const TEAMS_MEETING_LINK = "https://teams.microsoft.com/l/meetup-join/your-meeting-id";

export default function Dashboard({ employeeId }) {
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
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/auth/users/me', {
                    credentials: 'include',
                });
                const data = await res.json();
                console.log('User data:', data);
                setName(data.user.name);
            } catch (err) {
                console.error('Error fetching user:', err);
            }
        };
        fetchUser();
    }, []);


     const [copied, setCopied] = useState(false);
    
        const handleCopyLink = () => {
            navigator.clipboard.writeText(TEAMS_MEETING_LINK);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        };

const [tasks, setTasks] = useState([]);
const API_BASE = 'http://localhost:5000/api/tasks';

  useEffect(() => {
    fetch(API_BASE)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error('Error fetching tasks:', err));
  }, []);

  const now = new Date();

  const filteredTasks = tasks.filter(task => task.assignedTo === employeeId);

  const ongoingTasks = filteredTasks.filter(
    task => task.status === 'in progress' || task.status === 'ongoing'
  );

  const overdueTasks = filteredTasks.filter(task => {
    const createdAt = new Date(task.createdAt);
    const diffHours = (now - createdAt) / (1000 * 60 * 60);
    return diffHours > 24 && task.status !== 'completed';
  });

  const totalTasks = filteredTasks;



    return (
        <div className="flex min-h-screen">

            {/* Sidebar - 25% */}
            <aside className="w-1/4  bg-[#D4D5EE]  px-6 py-8 space-y-8 shadow-sm">
                <div>
                    <h1 className="text-3xl  mx-4 font-bold  text-[#3667B1]">TaskMate</h1>
                    <p className="text-blue-800  font-semibold text-lg text-left mx-4 py-2">Professional Task Manager</p>
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
                <nav className="space-y-6">
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
                            <Dropdown items={["New Task"]}className="text-xl" />
                        )}
                    </div>

                    {/* Projects */}
                    <div>
                        <div className="flex items-center gap-3 text-[#0b3676] border py-2 px-4 rounded-md text-lg font-semibold hover:text-blue-900 hover:bg-blue-100  hover:border-e-blue-950 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <ClipboardList className="w-5 h-5" />
                                <span>Projects</span>
                            </div>
                            <span onClick={() => toggleDropdown("projects")} className="cursor-pointer">+</span>
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
            <main className="w-1/2 bg-purple-200 px-6">
                <div className='flex items-center justify-between mb-6'>
                    <div>
                        <h2 className="text-2xl font-semibold mb-2">Hello, <span className="font-bold">{name} </span></h2>
                        <p className="text-gray-500 mb-4">Let&apos;s get things done!</p>
                    </div>

                    <div className='flex items-center gap-4'>
                        <div className="relative">
                            <input

                                placeholder="Search..."
                                className=" py-2 px-4 rounded-md border border-gray-300 focus:outline-none"
                            />
                            <Search className="absolute top-2.5 right-3  text-gray-400" />
                        </div>
                        <button
                            onClick={() => setOpenTaskForm(true)} className="bg-[#3667B1] text-white py-2 px-4 rounded-md hover:bg-purple-700 transition">+ New Task</button>
                        <NewTask open={openTaskForm} setOpen={setOpenTaskForm} />
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
                            <div className="text-sm text-gray-500 p-1">{label}</div>
                        </div>
                    ))}
                </div>

                {/* Ongoing Tasks */}
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
