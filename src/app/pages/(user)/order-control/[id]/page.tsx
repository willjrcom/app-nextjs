'use client';

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import RequestError from "@/app/api/error";
import { useCurrentOrder } from "@/app/context/current-order/context";
import { CartAdded } from "@/app/components/order/cart/cart-added";
import { CardOrderResume } from "@/app/components/order/resume/resume";

const PageEditOrderControl = () => {
    const { id } = useParams();
    const [error, setError] = useState<RequestError | null>(null)
    const { data } = useSession();
    const context = useCurrentOrder();

    const getOrder = useCallback(async () => {
        if (!id || !data) return;
        try {
            context.fetchData(id as string);
            setError(null);
        } catch (error) {
            setError(error as RequestError);
        }
    }, [data?.user.idToken, id]);

    useEffect(() => {
        getOrder();
    }, [data?.user.idToken]);

    if (!id || !context.order) {
        return (
            <>
            {error && <p className="mb-4 text-red-500">{error.message}</p>}
            <h1>Pedido não encontrado</h1>
            </>
        )
    }

    return (
        <div className="flex h-full bg-gray-100">
            <CartAdded />
            <CardOrderResume />
        </div>
    );
}
export default PageEditOrderControl