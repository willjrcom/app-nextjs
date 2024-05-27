'use client'

import CreateProductForm from "@/app/forms/product/create";
import CrudLayout from "@/components/crud/layout";
import Menu from "@/components/menu/layout";
import ButtonFilter from "@/components/crud/button-filter";
import ButtonPlus from "@/components/crud/button-plus";

const PageProducts = () => {
    return (
        <body>
            <Menu>
                <CrudLayout title="Produtos" 
                    filterButtonChildren={<ButtonFilter name="produto" />} 
                    plusButtonChildren={<ButtonPlus name="produto" href="/product/new"><CreateProductForm/></ButtonPlus>} 
                    tableChildren={<p>dados</p>}/>
            </Menu>
        </body>
    );
}

export default PageProducts