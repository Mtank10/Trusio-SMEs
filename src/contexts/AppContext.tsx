import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Product, Supplier, Survey, SurveyResponse, Document, Report } from '../types';

interface AppState {
  user: User | null;
  products: Product[];
  suppliers: Supplier[];
  surveys: Survey[];
  responses: SurveyResponse[];
  documents: Document[];
  reports: Report[];
  loading: boolean;
  error: string | null;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'SET_SUPPLIERS'; payload: Supplier[] }
  | { type: 'ADD_SUPPLIER'; payload: Supplier }
  | { type: 'UPDATE_SUPPLIER'; payload: Supplier }
  | { type: 'SET_SURVEYS'; payload: Survey[] }
  | { type: 'ADD_SURVEY'; payload: Survey }
  | { type: 'SET_RESPONSES'; payload: SurveyResponse[] }
  | { type: 'ADD_RESPONSE'; payload: SurveyResponse }
  | { type: 'SET_DOCUMENTS'; payload: Document[] }
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'SET_REPORTS'; payload: Report[] }
  | { type: 'ADD_REPORT'; payload: Report }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AppState = {
  user: null,
  products: [],
  suppliers: [],
  surveys: [],
  responses: [],
  documents: [],
  reports: [],
  loading: false,
  error: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'SET_SUPPLIERS':
      return { ...state, suppliers: action.payload };
    case 'ADD_SUPPLIER':
      return { ...state, suppliers: [...state.suppliers, action.payload] };
    case 'UPDATE_SUPPLIER':
      return {
        ...state,
        suppliers: state.suppliers.map(s => 
          s.id === action.payload.id ? action.payload : s
        ),
      };
    case 'SET_SURVEYS':
      return { ...state, surveys: action.payload };
    case 'ADD_SURVEY':
      return { ...state, surveys: [...state.surveys, action.payload] };
    case 'SET_RESPONSES':
      return { ...state, responses: action.payload };
    case 'ADD_RESPONSE':
      return { ...state, responses: [...state.responses, action.payload] };
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload };
    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] };
    case 'SET_REPORTS':
      return { ...state, reports: action.payload };
    case 'ADD_REPORT':
      return { ...state, reports: [...state.reports, action.payload] };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};