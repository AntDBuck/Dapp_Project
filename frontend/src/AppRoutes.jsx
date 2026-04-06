import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AllArticlesPage from "./pages/AllArticlesPage";
import NoPage from "./pages/NoPage";
import CreateArticlePage from "./pages/CreateArticlePage";

/**
 * AppRoutes functional component.
 * Defines routes to various page components and passes contract and account as props.
 * @param {*} props.contract The smart contract.
 * @param {string} props.account The hexidecimal string representing user's account.
 * @component
 * @returns {JSX.Element} Returns the routing functionality of the app.
 */
function AppRoutes({ contract, account })
{
    return (
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route 
                path='/all-articles' 
                element={<AllArticlesPage contract={contract} account={account} />} 
            />
            <Route 
                path='/create-article' 
                element={<CreateArticlePage contract={contract} account={account}/>}  
            />
            <Route path='*' element={<NoPage />} />
        </Routes>
    );
};

export default AppRoutes;