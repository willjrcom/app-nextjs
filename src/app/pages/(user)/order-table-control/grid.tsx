"use client";

import React, { CSSProperties, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import PlaceTable from "@/app/entities/place/place_table";
import { SelectField } from "@/app/components/modal/field";
import Place from "@/app/entities/place/place";
import RequestError from "@/app/api/error";
import Refresh from "@/app/components/crud/refresh";
import { useModal } from "@/app/context/modal/context";
import CardOrder from "@/app/components/order/card-order";
import OrderTable from "@/app/entities/order/order-table";
import { fetchTableOrders } from "@/redux/slices/table-orders";
import { FaPlus } from "react-icons/fa";
import NewOrderTable from "@/app/api/order-table/new/route";
import { useRouter } from "next/navigation";

const INITIAL_GRID_SIZE = 5; // Tamanho inicial da grade
class GridItem { x: number = 0; y: number = 0; constructor(x: number, y: number) { this.x = x; this.y = y; } };

// Função para gerar a matriz
const generateGrid = (rows: number, cols: number) => {
    const grid = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            grid.push({ x: col, y: row });
        }
    }
    return grid;
};

const DragAndDropGrid = () => {
    const placesSlice = useSelector((state: RootState) => state.places);
    const tableOrdersSlice = useSelector((state: RootState) => state.tableOrders);
    const [totalRows, setTotalRows] = useState(INITIAL_GRID_SIZE);
    const [totalCols, setTotalCols] = useState(INITIAL_GRID_SIZE);
    const [grid, setGrid] = useState(generateGrid(totalRows, totalCols));
    const [places, setPlaces] = useState<Place[]>(Object.values(placesSlice.entities));
    const [droppedTables, setDroppedTables] = useState<PlaceTable[]>([]);
    const [tableOrders, setTableOrders] = useState<OrderTable[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const { data } = useSession();
    const [placeSelectedID, setPlaceSelectedID] = useState<string>("");
    const [error, setError] = useState<RequestError | null>(null);

    useEffect(() => {
        if (data) {
            dispatch(fetchTableOrders(data));
        }

        const interval = setInterval(() => {
            if (data) {
                dispatch(fetchTableOrders(data));
            }
        }, 30000); // Atualiza a cada 60 segundos

        return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
    }, [data?.user.idToken, dispatch])

    useEffect(() => {
        setTableOrders(Object.values(tableOrdersSlice.entities));
    }, [tableOrdersSlice.entities])

    useEffect(() => {
        setPlaces(Object.values(placesSlice.entities));

        const firstPlace = Object.values(placesSlice.entities)[0];
        if (!firstPlace) return
        if (placeSelectedID === "") setPlaceSelectedID(firstPlace.id)
    }, [placesSlice.entities])

    useEffect(() => {
        const place = placesSlice.entities[placeSelectedID]
        if (!place) return;

        setDroppedTables(place.tables || []);
        reloadGrid(place.tables);
    }, [placeSelectedID])

    useEffect(() => {
        if (error && error.message != "") {
            setTimeout(() => {
                setError(null);
            }, 10000);
        }
    }, [error])

    const reloadGrid = (tables: PlaceTable[]) => {
        if (!tables || tables.length === 0) return;
        const xyPositions = tables.map((table) => new GridItem(table.column, table.row))

        // Encontrar o maior x (column) e maior y (row)
        const { maxX, maxY } = xyPositions.reduce(
            (acc, pos) => ({
                maxX: Math.max(acc.maxX, pos.x),
                maxY: Math.max(acc.maxY, pos.y),
            }),
            { maxX: 0, maxY: 0 } // Valores iniciais
        );

        setGrid(generateGrid(maxY < 5 ? 5 : maxY + 1, maxX < 5 ? 5 : maxX + 1));
        setTotalRows(maxY < 5 ? 5 : maxY + 1);
        setTotalCols(maxX < 5 ? 5 : maxX + 1);
    }

    return (
        <>
            {error && <p className="mb-4 text-red-500">{error.message}</p>}
            <div className="flex justify-center">
                <div>
                    <div className="flex items-center justify-between">
                        <SelectField friendlyName="" name="place" selectedValue={placeSelectedID} setSelectedValue={setPlaceSelectedID} values={places} 
                        optional/>
                        <Refresh slice={tableOrdersSlice} fetchItems={fetchTableOrders} />
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${totalCols - 1}, 100px) auto`,
                            gridTemplateRows: `repeat(${totalRows}, 80px) auto`,
                            gap: "4px",
                            position: "relative",
                            backgroundColor: "#f4f4f4",
                            padding: "20px",
                        }}
                    >
                        {/* Células da grade */}
                        {grid.map((cell) => (
                            <Cell key={`${cell.x}-${cell.y}`}>
                                {droppedTables?.filter((item) => item.column === cell.x && item.row === cell.y)
                                    .map((item) => (
                                        <TableItem key={`${item.table_id}-${item.row}-${item.column}`} placeTable={item} order={tableOrders?.find((order) => order.table_id === item.table_id && order.status !== "Closed")} />
                                    ))}
                            </Cell>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

const TableItem = ({ placeTable, order }: { placeTable: PlaceTable, order?: OrderTable }) => {
    const [error, setError] = useState<RequestError | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { data } = useSession();
    const router = useRouter();
    const modalHandler = useModal();
    const style = {
        width: "80px",
        height: "60px",
        zIndex: 1000,
    };

    const openModal = () => {
        // New order
        if (!order) {

            const onClose = () => {
                modalHandler.hideModal("new-table")
            }

            const newOrder = async (tableID: string) => {
                if (!data) return
                try {
                    const response = await NewOrderTable(tableID, data)
                    router.push('/pages/order-control/' + response.order_id)
                    dispatch(fetchTableOrders(data));
                    setError(null);
                    onClose()
                } catch (error) {
                    setError(error as RequestError);
                }
            }

            const button = () => (
                <>
                    {error && <p className="mb-4 text-red-500">{error.message}</p>}
                    <p className="mb-4"><strong>Mesa:</strong> {placeTable.table.name}</p>
                    <p className="mb-4">Deseja iniciar um novo pedido?</p>
                    <button onClick={() => newOrder(placeTable.table_id)} className="flex items-center space-x-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-max">
                        <FaPlus />
                        <span>Iniciar</span>
                    </button>
                </>
            )

            modalHandler.showModal("new-table", "Nova mesa", button(), "md", onClose);
            return
        }

        const onClose = () => {
            modalHandler.hideModal("show-order-" + order.order_id)
        }

        modalHandler.showModal("show-order-" + order.order_id, "Editar mesa", <CardOrder orderId={order.order_id} />, "xl", onClose);
    }

    return (
        <div
            onClick={openModal}
            style={{
                ...style,
                backgroundColor: (order && order.status !== "Closed") ? "lightgreen" : "lightblue",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "grab",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <p className="text-sm">{placeTable?.table.name || "Sem Nome"}</p>
        </div>
    );
};

// Componente Droppable (células da mesa)
const Cell = ({ children }: { children?: React.ReactNode }) => {
    const style: CSSProperties = {
        border: "1px dashed #ccc",
        width: "100px",
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    };

    return (
        <div style={style}>
            {children}
        </div>
    );
};

export default DragAndDropGrid;
