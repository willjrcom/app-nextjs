import RequestError from "@/app/api/error";
import NewComplementGroupItem from "@/app/api/group-item/update/complement/route";
import { useModal } from "@/app/context/modal/context";
import GroupItem from "@/app/entities/order/group-item";
import Product from "@/app/entities/product/product";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

interface ComplementCardProps {
    groupItem?: GroupItem | null;
    product: Product;
}

const ComplementCard = ({ groupItem, product }: ComplementCardProps) => {
    const { data } = useSession();
    const [error, setError] = useState<RequestError | null>(null);
    const modalHandler = useModal();

    const submit = async () => {
        if (!data) return

        try {
            NewComplementGroupItem(groupItem?.id || "", product.id, data)
            setError(null)
            modalHandler.hideModal("add-complement-item-group-item-" + groupItem?.id)
        } catch (error) {
            setError(error as RequestError)
        }
    }

    return (
        <div className="relative p-4 bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow duration-200 w-full max-w-sm mx-auto">
            {/* Imagem do produto */}
            <div className="relative flex justify-center items-center">
                <Image
                    src={product.image_path}
                    alt={`Imagem do produto ${product.name}`}
                    width={200}
                    height={130}
                    className="rounded-lg mb-2 object-cover"
                />
                {/* Código do produto */}
                <span
                    className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-lg opacity-80"
                    aria-label={`Código do produto ${product.code}`}
                >
                    #&nbsp;{product.code}
                </span>
            </div>

            {/* Informações do Produto */}
            <div className="text-center">
                <h2 className="font-bold text-lg mb-1">{product.name}</h2>
                <p className="text-gray-600 mb-2">R$ {product.price.toFixed(2)}</p>
            </div>

            {error && <p className="text-red-500 mb-4">{error.message}</p>}

            {/* Tamanhos e botão */}
            <div className="flex items-center justify-between space-x-2">
                {/* Tamanhos */}
                <div></div>

                {/* Botão para adicionar */}
                <button onClick={submit} className={`flex items-center space-x-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-max`}>
                    <FaPlus />
                </button>
            </div>
        </div>
    );
};

export default ComplementCard;
