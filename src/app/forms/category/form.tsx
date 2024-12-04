'use client';

import React, { useEffect, useState } from 'react';
import { TextField, HiddenField, CheckboxField } from '../../components/modal/field';
import Category, { ValidateCategoryForm } from '@/app/entities/category/category';
import ButtonsModal from '../../components/modal/buttons-modal';
import { useSession } from 'next-auth/react';
import CreateFormsProps from '../create-forms-props';
import DeleteCategory from '@/app/api/category/delete/route';
import { useCategories } from '@/app/context/category/context';
import NewCategory from '@/app/api/category/new/route';
import UpdateCategory from '@/app/api/category/update/route';
import { useModal } from '@/app/context/modal/context';
import ErrorForms from '../../components/modal/error-forms';
import RequestError from '@/app/api/error';
import RemovableItensComponent from './removable-ingredients';
import AdditionalCategorySelector from './additional-category';
import ComplementCategorySelector from './complement-category';

const CategoryForm = ({ item, isUpdate }: CreateFormsProps<Category>) => {
    const modalName = isUpdate ? 'edit-category-' + item?.id : 'new-category'
    const modalHandler = useModal();
    const context = useCategories();
    const [category, setCategory] = useState<Category>(item || new Category());
    const [selectedType, setSelectedType] = useState<TypeCategory>("Normal");
    const { data } = useSession();
    const [error, setError] = useState<RequestError | null>(null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        if (item?.is_additional) setSelectedType("Adicional");
        if (item?.is_complement) setSelectedType("Complemento");
        if (!item?.is_additional && !item?.is_complement) setSelectedType("Normal");
    }, [item])

    useEffect(() => {
        const setType: Record<TypeCategory, () => void> = {
            "Normal": () => setCategory(prev => ({ ...prev, is_complement: false, is_additional: false })),
            "Complemento": () => setCategory(prev => ({ ...prev, is_complement: true, is_additional: false })),
            "Adicional": () => setCategory(prev => ({ ...prev, is_complement: false, is_additional: true }))
        }

        setType[selectedType]()
    }, [selectedType])

    const handleInputChange = (field: keyof Category, value: any) => {
        setCategory(prev => ({ ...prev, [field]: value }));
    };

    const submit = async () => {
        if (!data) return;

        const validationErrors = ValidateCategoryForm(category);
        if (Object.values(validationErrors).length > 0) return setErrors(validationErrors);

        try {
            const response = isUpdate ? await UpdateCategory(category, data) : await NewCategory(category, data)
            setError(null);

            if (!isUpdate) {
                category.id = response
                context.addItem(category);
            } else {
                context.updateItem(category);
            }

            modalHandler.hideModal(modalName);

        } catch (error) {
            setError(error as RequestError);
        }
    }

    const onDelete = async () => {
        if (!data) return;
        DeleteCategory(category.id, data);
        context.removeItem(category.id)
        modalHandler.hideModal(modalName);
    }

    const isUpdated = JSON.stringify(category) !== JSON.stringify(item)

    return (
        <>
            <TextField friendlyName='Nome' name='name' setValue={value => handleInputChange('name', value)} value={category.name} />
            <TextField friendlyName='Imagem' name='image_path' setValue={value => handleInputChange('image_path', value)} value={category.image_path} />
            <CheckboxField friendlyName='Deseja imprimir no pedido?' name='need_print' setValue={value => handleInputChange('need_print', value)} value={category.need_print} />
            <RemovableItensComponent item={category} setItem={setCategory} />
            <TypeCategorySelector selectedType={selectedType} setSelectedType={setSelectedType} />
            {selectedType === "Normal" && <AdditionalCategorySelector additionalCategories={context.items} selectedCategory={category} setSelectedCategory={setCategory} />}
            {selectedType === "Normal" && <ComplementCategorySelector complementCategories={context.items} selectedCategory={category} setSelectedCategory={setCategory} />}
            <HiddenField name='id' setValue={value => handleInputChange('id', value)} value={category.id} />

            {error && <p className="mb-4 text-red-500">{error.message}</p>}
            <ErrorForms errors={errors} />
            <hr className="my-4" />
            {isUpdated && <ButtonsModal item={category} name="quantity" onSubmit={submit} deleteItem={onDelete} />}
            {!isUpdated && <ButtonsModal item={category} name="quantity" deleteItem={onDelete} />}
        </>
    );
};

type TypeCategory = "Normal" | "Adicional" | "Complemento";

interface TypeCategorySelectorProps {
    selectedType: TypeCategory;
    setSelectedType: (type: TypeCategory) => void
}

const TypeCategorySelector = ({ selectedType, setSelectedType }: TypeCategorySelectorProps) => {
    const types: TypeCategory[] = ["Normal", "Adicional", "Complemento"];

    useEffect(() => {
        types.forEach((type) => {
            if (type === "Normal") setSelectedType(type);
        })
    }, [])

    return (
        <div className="mb-4">
            <div className="flex flex-col mt-2 space-y-2">
                <label className="block text-gray-700 text-sm font-bold">
                    Selecione o tipo de categoria:
                </label>

                <div className="flex space-x-2">
                    {types.map((type) => (
                        <button
                            key={type}
                            className={`p-3 h-10 ${selectedType === type
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-black"
                                } rounded-lg flex items-center justify-center hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
                            onClick={() => setSelectedType(type)}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryForm;
export { TypeCategorySelector }