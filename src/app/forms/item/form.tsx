import RequestError from "@/app/api/error";
import NewItem, { NewItemProps } from "@/app/api/item/new/route";
import ButtonsModal from "@/app/components/modal/buttons-modal"
import ErrorForms from "@/app/components/modal/error-forms"
import { TextField } from "@/app/components/modal/field";
import { useCategories } from "@/app/context/category/context";
import { useCurrentOrder } from "@/app/context/current-order/context";
import { useGroupItem } from "@/app/context/group-item/context";
import { useModal } from "@/app/context/modal/context";
import Item from "@/app/entities/order/item";
import Product from "@/app/entities/product/product";
import Quantity from "@/app/entities/quantity/quantity";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface AddProductCardProps {
  product: Product;
}

const AddProductCard = ({ product }: AddProductCardProps) => {
  const modalName = 'add-item-' + product.id
  const modalHandler = useModal();
  const contextCurrentOrder = useCurrentOrder();
  const contextGroupItem = useGroupItem();
  const { data } = useSession();
  const [quantity, setQuantity] = useState<Quantity>(new Quantity());
  const [observation, setObservation] = useState('');
  const [error, setError] = useState<RequestError | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const submit = async () => {
    if (!contextCurrentOrder.order || !quantity || !data) return;

    try {
      const body = {
        product_id: product.id,
        quantity_id: quantity?.id,
        order_id: contextCurrentOrder.order.id,
        observation: observation,
      } as NewItemProps

      if (contextGroupItem.groupItem?.id) {
        body.group_item_id = contextGroupItem.groupItem.id
      }

      const response = await NewItem(body, data)
      contextGroupItem.fetchData(response.group_item_id);

      modalHandler.hideModal(modalName);
    } catch (error) {
      setError(error as RequestError);
    }
  }

  return (
    <div className="overflow-y-auto h-[15vh]">
      <QuantitySelector categoryID={product.category_id} selectedQuantity={quantity} setSelectedQuantity={setQuantity} />
      <TextField friendlyName="Observação" name="observation" placeholder="Digite a observação" setValue={setObservation} value={observation} />
      {error && <p className="mb-4 text-red-500">{error.message}</p>}
      <ErrorForms errors={errors} />
      <ButtonsModal onSubmit={submit} onCancel={() => modalHandler.hideModal(modalName)} />
    </div>
  )
}

interface QuantitySelectorProps {
  categoryID: string
  selectedQuantity: Quantity
  setSelectedQuantity: (quantity: Quantity) => void
}

const QuantitySelector = ({ categoryID, selectedQuantity, setSelectedQuantity }: QuantitySelectorProps) => {
  const contextCategory = useCategories();
  const [quantities, setQuantities] = useState<Quantity[]>([]);

  useEffect(() => {
    if (!contextCategory) return;
    const category = contextCategory.findByID(categoryID);
    setQuantities(category?.quantities || []);
  }, [contextCategory])

  return (
    <div className="mb-4">
      <div className="flex flex-col mt-2 space-y-2">
        <label className="block text-gray-700 text-sm font-bold">
          Selecione uma quantidade:
        </label>

        <div className="flex space-x-2">
          {quantities.map((quantity) => (
            <button
              key={quantity.id}
              className={`w-10 h-10 ${selectedQuantity.id === quantity.id
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
                } rounded-lg flex items-center justify-center hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
              onClick={() => setSelectedQuantity(quantity)}
            >
              {quantity.quantity}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddProductCard