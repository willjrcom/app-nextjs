import ClientAddressForm from "@/app/forms/client/update-address-order";
import ButtonIcon from "../button/button-icon";
import StatusComponent from "../button/show-status";
import { useCurrentOrder } from "@/app/context/current-order/context";
import { useEffect, useState } from "react";
import Order from "@/app/entities/order/order";

const DeliveryCard = () => {
    const contextCurrentOrder = useCurrentOrder();
    const [order, setOrder] = useState<Order | null>(contextCurrentOrder.order);

    useEffect(() => {
        setOrder(contextCurrentOrder.order)
    }, [contextCurrentOrder.order])

    if (!order || !order.delivery) return null
    const delivery = order?.delivery;
    const client = delivery?.client;
    const address = client?.address;
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex justify-between items-center">
                <h2 className="font-bold mb-2">Entrega</h2>
                <ButtonIcon modalName={"edit-client-" + delivery?.client_id} title="Editar cliente" size="md">
                    <ClientAddressForm item={delivery?.client} deliveryOrderId={delivery?.id} />
                </ButtonIcon>
            </div>

            <p>{client?.name}</p>
            {delivery?.status && <p><StatusComponent status={delivery?.status} /></p>}
            <p>Endereço: {address?.street}, {address?.number}</p>
            <p>Bairro: {address?.neighborhood}</p>
            <p>Cidade: {address?.city}</p>
            <p>Cep: {address?.cep}</p>
        </div>
    )
}

export default DeliveryCard