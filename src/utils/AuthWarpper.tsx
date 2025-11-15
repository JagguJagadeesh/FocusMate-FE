'use client'
import TypingLoader from "@/components/Loaders/TypingLoader"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"



export function withAuth(Component: any) {
    return function Protected(props: any) {
        const router = useRouter()
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const token = localStorage.getItem("token");
            if (!token) router.replace('/auth/signin');
            else setLoading(false)
        }, [router])
        if (loading) return <TypingLoader />;
        return <Component {...props} />
    }
}
export function withoutAuth(Component: any) {
    return function Unprotected(props: any) {
        const router = useRouter()
        const [loading, setLoading] = useState(true)
        useEffect(() => {
            const token = localStorage.getItem("token")
            if (token) router.replace('/dashboard');
            else setLoading(false);
        }, [router])
        if (loading) return <TypingLoader />;
        return <Component {...props} />
    }
}