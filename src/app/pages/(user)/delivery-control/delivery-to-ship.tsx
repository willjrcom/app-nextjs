import ButtonIconTextFloat from "@/app/components/button/button-float";
import Refresh from "@/app/components/crud/refresh";
import CrudTable from "@/app/components/crud/table";
import Map, { Point } from "@/app/components/map/map";
import Address from "@/app/entities/address/address";
import DeliveryOrderColumns from "@/app/entities/order/delivery-table-columns";
import Order from "@/app/entities/order/order";
import { fetchDeliveryOrders } from "@/redux/slices/delivery-orders";
import { AppDispatch, RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const DeliveryOrderToShip = () => {
    const deliveryOrdersSlice = useSelector((state: RootState) => state.deliveryOrders);
    const [deliveryOrders, setDeliveryOrders] = useState<Order[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const [centerPoint, setCenterPoint] = useState<Point | null>(null);
    const [points, setPoints] = useState<Point[]>([]);
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const { data } = useSession();

    useEffect(() => {
        if (data && Object.keys(deliveryOrdersSlice.entities).length === 0) {
            dispatch(fetchDeliveryOrders(data));
        }

        const interval = setInterval(() => {
            if (data && !deliveryOrdersSlice) {
                dispatch(fetchDeliveryOrders(data));
            }
        }, 60000); // Atualiza a cada 60 segundos

        return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
    }, [data?.user.idToken]);

    useEffect(() => {
        console.log(deliveryOrdersSlice.entities)
        setDeliveryOrders(Object.values(deliveryOrdersSlice.entities));
    }, [deliveryOrdersSlice.entities]);

    useEffect(() => {
        if (!data || !data?.user?.currentCompany?.address) return
        const company = data?.user?.currentCompany;
        const coordinates = company.address.coordinates

        const point = { id: company.id, lat: coordinates.latitude, lng: coordinates.longitude, label: company.trade_name } as Point;
        setCenterPoint(point);
    }, [data?.user.idToken])

    useEffect(() => {
        const newPoints: Point[] = [];
        for (let deliveryOrder of deliveryOrders) {
            const address = Object.assign(new Address(), deliveryOrder.delivery?.address);
            if (!address) continue;

            const coordinates = address.coordinates
            if (!coordinates) continue;

            const point = { id: deliveryOrder.id, lat: coordinates.latitude, lng: coordinates.longitude, label: address.getSmallAddress() } as Point;
            newPoints.push(point);
        }

        setPoints(newPoints);
    }, [deliveryOrders])

    return (
        <>
            <div className="flex justify-end items-center">
                <Refresh slice={deliveryOrdersSlice} fetchItems={fetchDeliveryOrders} />
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-start">
                {/* Tabela */}
                <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg p-4">
                    <CrudTable columns={DeliveryOrderColumns()} data={deliveryOrders} showCheckbox={true} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
                </div>
                {/* Mapa */}
                <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg p-4">
                    <Map centerPoint={centerPoint} points={points} />
                </div>
            </div>
            <ButtonIconTextFloat modalName="ship-delivery" icon={FaPaperPlane} title="Enviar entrega" position="bottom-right">
                <h1>Enviar entrega(s)</h1>
            </ButtonIconTextFloat>
        </>
    )
}

export default DeliveryOrderToShip