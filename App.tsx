import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { CartItem, Product, View, Employee, Transaction, StoreInfo, Supplier, CashDrawerOperation } from './types';
import Sidebar from './components/Sidebar';
import Cart from './components/Cart';
import PaymentModal from './components/PaymentModal';
import ActionPanel from './components/ActionPanel';
import AISuggestionsModal from './components/AISuggestionsModal';
import Home from './components/Home';
import Products from './components/Products';
import Employees from './components/Employees';
import Reports from './components/Reports';
import SalesHistory from './components/SalesHistory';
import ProductEditModal from './components/ProductEditModal';
import ProductAddModal from './components/ProductAddModal';
import EmployeeAddModal from './components/EmployeeAddModal';
import OperatorLoginModal from './components/OperatorLoginModal';
import SellOnCreditModal from './components/SellOnCreditModal';
import SellInInstallmentsModal from './components/SellInInstallmentsModal';
import Settings from './components/Settings';
import Suppliers from './components/Suppliers';
import SupplierAddModal from './components/SupplierAddModal';
import SangriaModal from './components/SangriaModal';
import SuprimentoModal from './components/SuprimentoModal';
import { getAISuggestions } from './services/geminiService';
import { MOCK_PRODUCTS, MOCK_EMPLOYEES, MOCK_TRANSACTIONS } from './services/mockData';
import { MOCK_SUPPLIERS } from './constants';
import * as cache from './services/cacheService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isSellOnCreditModalOpen, setSellOnCreditModalOpen] = useState(false);
  const [isSellInInstallmentsModalOpen, setSellInInstallmentsModalOpen] = useState(false);
  const [initialPaymentMethod, setInitialPaymentMethod] = useState<Transaction['paymentMethod'] | null>(null);
  const [lastScannedItem, setLastScannedItem] = useState<Product | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
  
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [isAddEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);
  
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [isAddSupplierModalOpen, setAddSupplierModalOpen] = useState(false);

  const [isSuggestionsModalOpen, setSuggestionsModalOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isSuggestionsLoading, setSuggestionsLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const [allTransactions, setAllTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  const [activeOperator, setActiveOperator] = useState<Employee | null>(null);
  
  const [isSangriaModalOpen, setSangriaModalOpen] = useState(false);
  const [isSuprimentoModalOpen, setSuprimentoModalOpen] = useState(false);
  const [cashDrawerOperations, setCashDrawerOperations] = useState<CashDrawerOperation[]>([]);
  
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  const [storeInfo, setStoreInfo] = useState<StoreInfo>(() => {
    return cache.get<StoreInfo>('storeInfo') || {
      name: 'Supermarket Pro',
      address: 'Rua Principal, 123, Centro',
      cnpj: '12.345.678/0001-99',
      logoUrl: '',
    };
  });

  const lowStockProducts = useMemo(() => {
    return products.filter(p => p.stock <= p.lowStockThreshold);
  }, [products]);

  // Effect for managing the theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  // Effect for the clock timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  const handleThemeToggle = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleStoreInfoChange = (newInfo: StoreInfo) => {
    setStoreInfo(newInfo);
    cache.set('storeInfo', newInfo);
  };
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);

    // Prioritize exact barcode match for numeric inputs, simulating a scanner
    if (query.length > 5 && /^\d+$/.test(query)) {
        const exactBarcodeMatch = products.find(p => p.barcode === query);
        if (exactBarcodeMatch) {
            addToCart(exactBarcodeMatch.barcode);
            setSearchQuery('');
            setSearchResults([]);
            return; // Stop further processing
        }
    }

    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    // Continue with regular search if no barcode match
    const lowerCaseQuery = query.toLowerCase();
    const results = products.filter(p => 
      p.name.toLowerCase().includes(lowerCaseQuery) ||
      p.barcode.includes(query)
    );
    setSearchResults(results);
  };


  const handleSelectProduct = (product: Product) => {
    addToCart(product.barcode);
    setSearchQuery('');
    setSearchResults([]);
  };
  
  const handleSearchSubmit = (query: string) => {
      if (query.trim() === '') return;
      
      const lowerCaseQuery = query.toLowerCase();
      const results = products.filter(p => 
        p.name.toLowerCase().includes(lowerCaseQuery) ||
        p.barcode.includes(query)
      );

      const exactBarcodeMatch = results.find(p => p.barcode === query);
      if(exactBarcodeMatch){
          addToCart(exactBarcodeMatch.barcode);
          setSearchQuery('');
          setSearchResults([]);
          return;
      }
      
      if (results.length === 1) {
        addToCart(results[0].barcode);
        setSearchQuery('');
        setSearchResults([]);
      }
  };


  const resetTransaction = useCallback(() => {
    setCartItems([]);
    setLastScannedItem(null);
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  const handleClearCartWithConfirmation = () => {
    if (cartItems.length > 0 && window.confirm('Tem certeza que deseja cancelar a venda? Todos os itens serão removidos.')) {
      resetTransaction();
    } else if (cartItems.length === 0) {
      resetTransaction();
    }
  };


  const addToCart = useCallback((barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (!product) {
      alert('Produto não encontrado!');
      return;
    }

    const existingItem = cartItems.find(item => item.product.id === product.id);
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;

    if (product.stock <= currentQuantityInCart) {
        alert(`Estoque insuficiente para "${product.name}". Apenas ${product.stock} unidades disponíveis.`);
        return;
    }

    setLastScannedItem(product);
    setCartItems(prevItems => {
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  }, [products, cartItems]);

  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
    setCartItems(prevItems => {
      const itemToUpdate = prevItems.find(item => item.product.id === productId);
      if (itemToUpdate && newQuantity > itemToUpdate.product.stock) {
          alert(`Estoque insuficiente. Apenas ${itemToUpdate.product.stock} unidades de "${itemToUpdate.product.name}" disponíveis.`);
          return prevItems;
      }

      if (newQuantity <= 0) {
        return prevItems.filter(item => item.product.id !== productId);
      }
      return prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  }, []);

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => {
    const price = item.product.promotion?.discountedPrice ?? item.product.salePrice;
    return sum + price * item.quantity;
  }, 0), [cartItems]);
  const tax = useMemo(() => subtotal * 0.05, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  const handleCheckout = (method?: Transaction['paymentMethod']) => {
    setInitialPaymentMethod(method ?? null);
    setPaymentModalOpen(true);
  };
  
  const finalizeTransaction = useCallback((transactionDetails: Omit<Transaction, 'id' | 'date' | 'employeeName'>) => {
    if (!activeOperator) return;
    
    const newTransaction: Transaction = {
        ...transactionDetails,
        id: `tx-${Date.now()}`,
        date: new Date().toISOString(),
        employeeName: activeOperator.name,
    };
    
    // Deduct stock
    setProducts(currentProducts => {
      const updatedProducts = currentProducts.map(p => ({ ...p }));
      newTransaction.items.forEach(item => {
        const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
        if (productIndex !== -1) {
          updatedProducts[productIndex].stock = Math.max(0, updatedProducts[productIndex].stock - item.quantity);
        }
      });
      return updatedProducts;
    });

    setAllTransactions(prev => [newTransaction, ...prev]);
  }, [activeOperator]);


  const handlePayment = useCallback((paymentMethod: Transaction['paymentMethod']) => {
    if (cartItems.length === 0) {
      alert("Carrinho está vazio!");
      return;
    }
    if (!activeOperator) {
        alert('Erro: Nenhum operador está logado para finalizar a venda.');
        return;
    }

    finalizeTransaction({
        total: total,
        employeeId: activeOperator.id,
        items: cartItems.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.promotion?.discountedPrice ?? item.product.salePrice,
        })),
        customerName: 'Consumidor Final',
        paymentMethod: paymentMethod,
        status: 'Pago',
    });
    alert(`Pagamento de R$ ${total.toFixed(2)} confirmado!`);
    setPaymentModalOpen(false);
    resetTransaction();
  }, [cartItems, total, resetTransaction, activeOperator, finalizeTransaction]);
  
  const handleConfirmSellOnCredit = useCallback((customerName: string, dueDate: string) => {
    if (cartItems.length === 0) return alert("Carrinho está vazio!");
    if (!activeOperator) return alert('Erro: Nenhum operador está logado para finalizar a venda.');

    finalizeTransaction({
        total: total,
        employeeId: activeOperator.id,
        items: cartItems.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.promotion?.discountedPrice ?? item.product.salePrice,
        })),
        customerName: customerName,
        paymentMethod: 'Boleto',
        status: 'Pendente',
        boletoDueDate: dueDate,
    });
    alert(`Venda a prazo de R$ ${total.toFixed(2)} para ${customerName} registrada com sucesso!`);
    setSellOnCreditModalOpen(false);
    resetTransaction();
  }, [cartItems, total, resetTransaction, activeOperator, finalizeTransaction]);
  
  const handleConfirmSellInInstallments = useCallback((customerName: string, installmentsCount: number, cpf: string, cardNumber: string, bank: string) => {
    if (cartItems.length === 0) return alert("Carrinho está vazio!");
    if (!activeOperator) return alert('Erro: Nenhum operador está logado para finalizar a venda.');

    const installmentValue = total / installmentsCount;

    finalizeTransaction({
        total: total,
        employeeId: activeOperator.id,
        items: cartItems.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.promotion?.discountedPrice ?? item.product.salePrice,
        })),
        customerName: customerName,
        paymentMethod: 'Cartão',
        status: 'Pago',
        installments: { count: installmentsCount, value: installmentValue },
        cpf,
        cardNumber,
        bank,
    });
    alert(`Venda parcelada de R$ ${total.toFixed(2)} para ${customerName} em ${installmentsCount}x registrada com sucesso!`);
    setSellInInstallmentsModalOpen(false);
    resetTransaction();
  }, [cartItems, total, resetTransaction, activeOperator, finalizeTransaction]);

  const handleFetchSuggestions = async () => {
    setSuggestionsModalOpen(true);
    setSuggestionsLoading(true);
    try {
      const suggestions = await getAISuggestions(cartItems);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error(error);
      setAiSuggestions(['Erro ao buscar sugestões.']);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleSaveProduct = (updatedProduct: Product) => {
    setProducts(prevProducts => prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setCartItems(prevCart => prevCart.map(item => 
        item.product.id === updatedProduct.id 
        ? {...item, product: updatedProduct}
        : item
    ));
    if (lastScannedItem?.id === updatedProduct.id) {
        setLastScannedItem(updatedProduct);
    }
    setProductToEdit(null);
  };
  
  const handleAddProduct = (newProductData: Omit<Product, 'id'>) => {
      const newProduct: Product = {
          id: `prod-${Date.now()}`,
          ...newProductData,
      };
      setProducts(prev => [...prev, newProduct].sort((a, b) => a.name.localeCompare(b.name)));
      setAddProductModalOpen(false);
  };
  
  const handleAddEmployee = (newEmployeeData: Omit<Employee, 'id' | 'employeeId'>) => {
      const newEmployeeId = `EMP-${String(Date.now()).slice(-4)}`;
      const newEmployee: Employee = {
          id: `emp-${Date.now()}`,
          ...newEmployeeData,
          employeeId: newEmployeeId,
      };
      setEmployees(prev => [...prev, newEmployee].sort((a,b) => a.name.localeCompare(b.name)));
      setAddEmployeeModalOpen(false);
  };

  const handleAddSupplier = (newSupplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
        id: `sup-${Date.now()}`,
        ...newSupplierData,
    };
    setSuppliers(prev => [...prev, newSupplier].sort((a, b) => a.name.localeCompare(b.name)));
    setAddSupplierModalOpen(false);
  };

  const handleOperatorLogin = (operator: Employee) => {
    setActiveOperator(operator);
  };

  const handleOperatorLogout = () => {
    if (cartItems.length > 0) {
        if (window.confirm('A venda atual não foi finalizada e será perdida. Deseja sair mesmo assim?')) {
            resetTransaction();
            setActiveOperator(null);
        }
    } else {
        setActiveOperator(null);
    }
  };
  
  const handleResetData = () => {
    if (window.confirm('Tem certeza de que deseja restaurar todos os dados para o padrão? Esta ação não pode ser desfeita.')) {
        setProducts(MOCK_PRODUCTS);
        setEmployees(MOCK_EMPLOYEES);
        setAllTransactions(MOCK_TRANSACTIONS);
        alert('Os dados foram restaurados com sucesso.');
        setActiveView('home');
    }
  };

  const handleConfirmSangria = useCallback((amount: number, reason: string) => {
    if (!activeOperator) {
      alert('Erro: Nenhum operador logado para registrar a sangria.');
      return;
    }
    if (amount <= 0) {
      alert('O valor da sangria deve ser maior que zero.');
      return;
    }
    
    const newOperation: CashDrawerOperation = {
      id: `op-${Date.now()}`,
      type: 'Sangria',
      amount,
      reason,
      employeeId: activeOperator.id,
      employeeName: activeOperator.name,
      date: new Date().toISOString(),
    };
  
    setCashDrawerOperations(prev => [newOperation, ...prev]);
    alert(`Sangria de R$ ${amount.toFixed(2)} registrada com sucesso.`);
    setSangriaModalOpen(false);
  }, [activeOperator]);

  const handleConfirmSuprimento = useCallback((amount: number, reason: string) => {
    if (!activeOperator) {
      alert('Erro: Nenhum operador logado para registrar o suprimento.');
      return;
    }
    if (amount <= 0) {
      alert('O valor do suprimento deve ser maior que zero.');
      return;
    }
    
    const newOperation: CashDrawerOperation = {
      id: `op-${Date.now()}`,
      type: 'Suprimento',
      amount,
      reason,
      employeeId: activeOperator.id,
      employeeName: activeOperator.name,
      date: new Date().toISOString(),
    };
  
    setCashDrawerOperations(prev => [newOperation, ...prev]);
    alert(`Suprimento de R$ ${amount.toFixed(2)} registrada com sucesso.`);
    setSuprimentoModalOpen(false);
  }, [activeOperator]);

  // Dashboard calculations
  const { totalRevenue, paidRevenue, pendingRevenue, totalSalesCount } = useMemo(() => {
    const totalRevenue = allTransactions.reduce((sum, tx) => sum + tx.total, 0);
    const paidRevenue = allTransactions
        .filter(tx => tx.status === 'Pago')
        .reduce((sum, tx) => sum + tx.total, 0);
    const pendingRevenue = allTransactions
        .filter(tx => tx.status === 'Pendente')
        .reduce((sum, tx) => sum + tx.total, 0);
    const totalSalesCount = allTransactions.length;

    return { totalRevenue, paidRevenue, pendingRevenue, totalSalesCount };
  }, [allTransactions]);

  const dashboardData = useMemo(() => {
    const productSales: { [productId: string]: number } = {};
    allTransactions.forEach(tx => {
        tx.items.forEach(item => {
            productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
        });
    });

    const topSellingProducts = Object.entries(productSales)
        .sort(([, qtyA], [, qtyB]) => qtyB - qtyA)
        .slice(0, 5)
        .map(([productId, quantity]) => {
            const product = products.find(p => p.id === productId);
            return {
                name: product?.name || 'Produto Desconhecido',
                quantity,
            };
        });

    const salesByPaymentMethod: { [method: string]: number } = { 'Dinheiro': 0, 'PIX': 0, 'Cartão': 0, 'Boleto': 0 };
    allTransactions.forEach(tx => {
        salesByPaymentMethod[tx.paymentMethod] = (salesByPaymentMethod[tx.paymentMethod] || 0) + tx.total;
    });

    const dailySales: { date: string; total: number }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dailySales.push({
            date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            total: 0,
        });
    }
    
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    allTransactions.forEach(tx => {
        const txDate = new Date(tx.date);
        if (txDate >= sevenDaysAgo) {
            const dateStr = new Date(tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            const dayData = dailySales.find(d => d.date === dateStr);
            if (dayData) {
                dayData.total += tx.total;
            }
        }
    });

    const averageTicket = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;
    
    return {
        topSellingProducts,
        salesByPaymentMethod: Object.entries(salesByPaymentMethod).map(([name, value]) => ({ name, value })),
        dailySales,
        averageTicket,
    };

  }, [allTransactions, products, totalRevenue, totalSalesCount]);


  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <Home 
          totalRevenue={totalRevenue}
          paidRevenue={paidRevenue}
          pendingRevenue={pendingRevenue}
          totalSalesCount={totalSalesCount}
          averageTicket={dashboardData.averageTicket}
          dailySales={dashboardData.dailySales}
          salesByPaymentMethod={dashboardData.salesByPaymentMethod}
          topSellingProducts={dashboardData.topSellingProducts}
          lowStockProducts={lowStockProducts.slice(0, 5)}
        />;
      case 'products':
        return <Products products={products} onEditProduct={setProductToEdit} onAddProduct={() => setAddProductModalOpen(true)} />;
      case 'employees':
        return <Employees employees={employees} onAddEmployee={() => setAddEmployeeModalOpen(true)} />;
      case 'suppliers':
        return <Suppliers suppliers={suppliers} onAddSupplier={() => setAddSupplierModalOpen(true)} />;
      case 'reports':
        return <Reports allTransactions={allTransactions} employees={employees} cashDrawerOperations={cashDrawerOperations} />;
      case 'sales-history':
        return <SalesHistory 
            transactions={allTransactions} 
            employees={employees} 
            totalRevenue={totalRevenue}
            paidRevenue={paidRevenue}
            pendingRevenue={pendingRevenue}
            totalSalesCount={totalSalesCount}
        />;
      case 'settings':
        return <Settings 
          onResetData={handleResetData} 
          storeInfo={storeInfo}
          onStoreInfoChange={handleStoreInfoChange}
          theme={theme}
          onThemeChange={setTheme}
        />;
      case 'pos':
        if (!activeOperator) {
            return <OperatorLoginModal employees={employees} onLogin={handleOperatorLogin} />;
        }
        return (
          <div className="flex h-full">
            <div className="flex-grow">
              <Cart 
                items={cartItems} 
                onUpdateQuantity={updateQuantity} 
                onEditProduct={setProductToEdit} 
                activeOperator={activeOperator}
                storeInfo={storeInfo}
                subtotal={subtotal}
                tax={tax}
                total={total}
              />
            </div>
            <div className="w-[450px] flex-shrink-0">
              <ActionPanel
                lastScannedItem={lastScannedItem}
                cartItems={cartItems}
                onClearCart={handleClearCartWithConfirmation}
                onCheckout={handleCheckout}
                onFetchSuggestions={handleFetchSuggestions}
                onSellOnCredit={() => setSellOnCreditModalOpen(true)}
                onSellInInstallments={() => setSellInInstallmentsModalOpen(true)}
                onSangria={() => setSangriaModalOpen(true)}
                onSuprimento={() => setSuprimentoModalOpen(true)}
                total={total}
                currentTime={currentTime}
                searchQuery={searchQuery}
                searchResults={searchResults}
                onSearchChange={handleSearchChange}
                onSelectProduct={handleSelectProduct}
                onSearchSubmit={handleSearchSubmit}
                activeOperator={activeOperator}
                onLogout={handleOperatorLogout}
              />
            </div>
          </div>
        );
      default:
        // FIX: Cast activeView to string to handle potential new views not yet fully implemented.
        // TypeScript infers 'never' here because all members of the 'View' type are handled in the switch,
        // but this default case serves as a fallback for future development.
        const viewName = activeView as string;
        return (
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-800">{viewName.charAt(0).toUpperCase() + viewName.slice(1)}</h1>
            <p className="text-gray-500 mt-4">Esta funcionalidade ainda não foi implementada.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-light-bg dark:bg-dark-bg font-sans">
      <Sidebar 
        activeView={activeView} 
        onNavigate={setActiveView} 
        lowStockCount={lowStockProducts.length} 
        theme={theme}
        onToggleTheme={handleThemeToggle}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderActiveView()}
      </main>
      {isPaymentModalOpen && (
        <PaymentModal
          total={total}
          subtotal={subtotal}
          tax={tax}
          onClose={() => setPaymentModalOpen(false)}
          onConfirmPayment={handlePayment}
          initialMethod={initialPaymentMethod}
        />
      )}
      {isSellOnCreditModalOpen && (
        <SellOnCreditModal
            total={total}
            onClose={() => setSellOnCreditModalOpen(false)}
            onConfirm={handleConfirmSellOnCredit}
        />
      )}
      {isSellInInstallmentsModalOpen && (
        <SellInInstallmentsModal
            total={total}
            onClose={() => setSellInInstallmentsModalOpen(false)}
            onConfirm={handleConfirmSellInInstallments}
        />
      )}
      {isSuggestionsModalOpen && (
          <AISuggestionsModal 
            isOpen={isSuggestionsModalOpen}
            onClose={() => setSuggestionsModalOpen(false)}
            suggestions={aiSuggestions}
            isLoading={isSuggestionsLoading}
          />
      )}
      {productToEdit && (
        <ProductEditModal 
            product={productToEdit}
            onClose={() => setProductToEdit(null)}
            onSave={handleSaveProduct}
        />
      )}
      {isAddProductModalOpen && (
        <ProductAddModal
            onClose={() => setAddProductModalOpen(false)}
            onSave={handleAddProduct}
        />
      )}
      {isAddEmployeeModalOpen && (
        <EmployeeAddModal
            onClose={() => setAddEmployeeModalOpen(false)}
            onSave={handleAddEmployee}
        />
      )}
      {isAddSupplierModalOpen && (
        <SupplierAddModal
            onClose={() => setAddSupplierModalOpen(false)}
            onSave={handleAddSupplier}
        />
      )}
      {isSangriaModalOpen && activeOperator && (
        <SangriaModal
          operatorName={activeOperator.name}
          onClose={() => setSangriaModalOpen(false)}
          onConfirm={handleConfirmSangria}
        />
      )}
      {isSuprimentoModalOpen && activeOperator && (
        <SuprimentoModal
          operatorName={activeOperator.name}
          onClose={() => setSuprimentoModalOpen(false)}
          onConfirm={handleConfirmSuprimento}
        />
      )}
    </div>
  );
};

export default App;