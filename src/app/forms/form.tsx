import Link from "next/link";

interface ModalProps {
    title: string;
    isUpdate: boolean;
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
    createHref: string;
}

const Form = ({ title, isUpdate, show, onClose, children, createHref }: ModalProps) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <form className="max-w-lg w-1/2 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h1>{title}</h1>
                <hr className="my-4" />
                {children}

                <div className="flex items-center justify-between mt-4">
                    <Link href={createHref}>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button">{isUpdate ? 'Atualizar' : 'Cadastrar'}</button>
                    </Link>

                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={onClose}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}




export default Form