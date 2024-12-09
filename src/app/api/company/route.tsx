import Company from "@/app/entities/company/company";
import RequestApi, { AddIdToken } from "../request";
import { Session } from "next-auth";

const GetCompany = async (session: Session): Promise<Company> => {
    const response = await RequestApi<null, Company>({
        path: "/company", 
        method: "GET",
        headers: await AddIdToken(session),
    });
    return response.data
};

export default GetCompany