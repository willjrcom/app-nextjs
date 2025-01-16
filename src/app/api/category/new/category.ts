import Category from "@/app/entities/category/category";
import RequestApi, { AddIdToken } from "../../request";
import { Session } from "next-auth";

const NewCategory = async (category: Category, session: Session): Promise<string> => {
    const response = await RequestApi<Category, string>({
        path: "/product-category/new", 
        method: "POST",
        body: category,
        headers: await AddIdToken(session),
    });

    return response.data
};

export default NewCategory