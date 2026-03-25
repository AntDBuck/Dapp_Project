import React from "react";
import { Switch, Route } from "react-router-dom";
import homePage from "./pages/homePage";
import aboutPage from "./pages/aboutPage";
import allArticlesPage from "./pages/allArticlespage";
import myArticlesPage from "./pages/myArticlesPage";
import noPage from "./pages/noPage";

function AppRoutes()
{
    return (
        <Switch>
            <Route path='/' element={<homePage />}></Route>
            <Route path='/about' element={<aboutPage />}></Route>
            <Route path='/all-articles' element={<allArticlesPage />}></Route>
            <Route path='/my-articles' element={<myArticlesPage />}></Route>
            <Route path='*' element={<noPage />}></Route>
        </Switch>
    );
};

export default AppRoutes;