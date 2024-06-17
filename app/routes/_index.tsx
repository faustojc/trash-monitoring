import {Button, Card, Label, Spinner, TextInput} from "flowbite-react";
import React, {FormEvent, useState} from "react";
import {firebaseAuth} from "~/domain/firebase";
import {signInWithEmailAndPassword} from "firebase/auth";
import {useNavigate} from "@remix-run/react";
import toast from "react-hot-toast";
import logo from "../resources/images/logo.png"

export default function Index() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email.length !== 0 && password.length !== 0) {
            setLoading(true);

            try {
                await signInWithEmailAndPassword(firebaseAuth, email, password);
                navigate("/dashboard");
            } catch (e) {
                console.log(e);
                toast.error("Wrong credentials!", {
                    duration: 3000,
                    position: "top-center",
                });
            }

            setLoading(false);
        }
    }

    return (
        <div className={"w-screen h-screen flex justify-center items-center"}>
            <Card className={"w-96"}>
                <div className="mb-3 flex justify-center">
                    <img className={"max-w-[150px]"} alt={"Logo"} src={logo}/>
                </div>
                <h2 className={'mb-4 text-center'}>Login to your account</h2>
                <form className="flex max-w-lg flex-col gap-4" onSubmit={handleLogin}>
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="username" value="Username"/>
                        </div>
                        <TextInput id="username"
                                   placeholder="name@gmail.com"
                                   addon="@"
                                   required
                                   onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={"mb-3"}>
                        <div className="mb-2 block">
                            <Label htmlFor="password" value="Password"/>
                        </div>
                        <TextInput id="password"
                                   type="password"
                                   addon={<svg className="w-[18px] h-[18px] text-gray-800 dark:text-white"
                                               aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                               height="24" fill="none" viewBox="0 0 24 24">
                                       <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                             strokeWidth="2"
                                             d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"/>
                                   </svg>

                                   }
                                   required
                                   onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button type="submit" onClick={() => setLoading(true)}>
                        {loading ? <Spinner/> : "Sign in"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
