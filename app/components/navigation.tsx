import {Dropdown, Navbar, NavbarCollapse} from "flowbite-react";
import logo from "~/resources/images/logo.png";
import {useEffect, useState} from "react";
import {signOut} from "firebase/auth";
import {firebaseAuth} from "~/domain/firebase";
import {useNavigate} from "@remix-run/react";

const Navigation = () => {
    const navigate = useNavigate();
    const [today, setToday] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setToday(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = async () => {
        localStorage.clear();

        try {
            await signOut(firebaseAuth);
            navigate("/")
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Navbar fluid rounded className={'shadow'}>
            <Navbar.Brand>
                <img src={`${logo}`} className="mr-3 h-6 sm:h-9" alt="logo"/>
                <span
                    className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Monitoring
                </span>
            </Navbar.Brand>
            <div className="flex md:order-2">
                <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                        </svg>
                    }
                >
                    <Dropdown.Header>
                        <span className="block text-sm font-bold">Admin</span>
                    </Dropdown.Header>
                    <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
                </Dropdown>
                <Navbar.Toggle/>
            </div>
            <NavbarCollapse>
                <p className="text-sm font-bold text-center">{today.toDateString()} {today.toLocaleTimeString()}</p>
            </NavbarCollapse>
        </Navbar>
    );
}

export default Navigation;
