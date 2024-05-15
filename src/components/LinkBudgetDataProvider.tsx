import React, { createContext, useContext, useEffect, useState } from 'react'
import { LinkBudgetData } from './LinkBudgetGraph'

// Create a context to store the fetched link budget data
interface DataContextType {
    linkBudgetData: LinkBudgetData | undefined;
    getLinkBudgetFromApi: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function LinkBudgetDataProvider({ children }: { children: React.ReactNode }) {
    const [linkBudgetData, setLinkBudgetData] = useState<LinkBudgetData>()

    // Fetch the backend data once on mount
    useEffect(() => {
        getLinkBudgetFromApi();
    }, []); // Empty array ensures this only runs on mount

    const getLinkBudgetFromApi = async () => {
        const hostname = window.location.hostname;
        const apiUrl = `http://${hostname}:3001/link_budget`

        return fetch(apiUrl)
            .then(response => response.json())
            .then(json => {
                setLinkBudgetData(json);
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <DataContext.Provider value={{ linkBudgetData, getLinkBudgetFromApi }}>
            {children}
        </DataContext.Provider>
    )
}

// Custom hook to access link budget data
function useLinkBudgetData() {
    const context = useContext(DataContext);
    if (context === undefined || context === null) {
        throw new Error('useLinkBudgetData must be used within a LinkBudgetDataProvider');
    }
    return context.linkBudgetData;
}

export { LinkBudgetDataProvider, useLinkBudgetData }