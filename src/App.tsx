import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';
import { storeAdd } from './Predictions/Predictions_Predictions';
import { beginCell, toNano } from '@ton/core';

const ADMIN_ID = 458417089; 
const CONTRACT_ADDRESS = "EQD0JqWNoqQepA7pC3BtELp6wrPRM8ReakHzwbYvDs-JVzqD";

function App() {
  const [events, setEvents] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tonConnectUI] = useTonConnectUI();

  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Крипта');

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    tg?.ready();
    tg?.expand();

    const user = tg?.initDataUnsafe?.user;
    if (user?.id === ADMIN_ID) { 
      setIsAdmin(true); 
    } else {
      setIsAdmin(false);
    }

    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setEvents(data);
    setLoading(false);
  }

  // Функция для совершения ставки
  async function placeBet(eventId: number, choice: 'yes' | 'no') {
    if (!tonConnectUI.connected) {
      alert('Пожалуйста, подключите кошелек!');
      return;
    }

    try {
      const amount = 1; // 1 TON
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 120,
        messages: [
          {
            address: CONTRACT_ADDRESS,
            amount: toNano(amount.toString()).toString(),
          },
        ],
      });

      const tg = (window as any).Telegram?.WebApp;
      const user = tg?.initDataUnsafe?.user;

      const { error } = await supabase
        .from('bets')
        .insert([{
          event_id: eventId,
          user_id: user?.id?.toString() || 'browser_user',
          amount: amount,
          selection: choice
        }]);

      if (!error) {
        alert(`Успешно! Ставка на ${choice === 'yes' ? 'ДА' : 'НЕТ'} принята.`);
        fetchEvents();
      }
    } catch (e) {
      console.error(e);
      alert('Ошибка при выполнении транзакции');
    }
  }

  // Функция создания пари
  async function createEvent() {
    if (!newTitle || !tonConnectUI.connected) return;

    const body = beginCell()
      .store(storeAdd({ $$type: 'Add', amount: 1n }))
      .endCell();

    try {
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [
          {
            address: CONTRACT_ADDRESS,
            amount: toNano('0.05').toString(),
            payload: body.toBoc().toString('base64'),
          },
        ],
      });

      const { error } = await supabase
        .from('events')
        .insert([{ 
          title: newTitle, 
          category: newCategory, 
          status: 'active',
          created_at: new Date().toISOString()
        }]);

      if (!error) {
        setNewTitle('');
        setShowForm(false);
        fetchEvents();
        alert("Транзакция отправлена! Пари скоро появится.");
      }
    } catch (e) {
      console.error("Ошибка транзакции:", e);
      alert("Ошибка при создании пари.");
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-50 min-h-screen font-sans text-gray-900">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tighter">INSIGHT</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Markets</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <TonConnectButton />
          {isAdmin && (
            <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
              ADMIN MODE
            </span>
          )}
        </div>
      </header>

      {isAdmin && !showForm && (
        <button 
          onClick={() => setShowForm(true)}
          className="w-full mb-6 bg-white border-2 border-dashed border-gray-300 text-gray-500 py-4 rounded-2xl font-bold hover:border-blue-500 hover:text-blue-500 transition-all"
        >
          + Создать новое пари
        </button>
      )}

      {isAdmin && showForm && (
        <div className="bg-white p-5 rounded-2xl shadow-xl border-2 border-blue-500 mb-6">
          <h2 className="font-black text-lg mb-4">Настройка нового пари</h2>
          <label className="text-xs font-bold text-gray-400 uppercase">Вопрос</label>
          <input 
            type="text" 
            placeholder="Например: TON пробит $10 до марта?" 
            className="w-full p-3 bg-gray-100 rounded-xl mb-4 mt-1"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />

          <label className="text-xs font-bold text-gray-400 uppercase">Категория</label>
          <select 
            className="w-full p-3 bg-gray-100 rounded-xl mb-6 mt-1"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          >
            <option value="Крипта">Крипта</option>
            <option value="Спорт">Спорт</option>
            <option value="Политика">Политика</option>
            <option value="Технологии">Технологии</option>
          </select>

          <div className="flex gap-2">
            <button onClick={createEvent} className="flex-[2] bg-blue-600 text-white py-3 rounded-xl font-bold">Опубликовать</button>
            <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl font-bold">Отмена</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {events.length === 0 && !loading && (
          <div className="text-center py-20 text-gray-300 font-bold">Активных рынков пока нет</div>
        )}
        
        {events.map((event) => (
          <div key={event.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                {event.category}
              </span>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Пул</p>
                <p className="text-sm font-black text-gray-900">{event.total_pool || 0} TON</p>
              </div>
            </div>
            
            <h3 className="text-lg font-bold leading-tight mb-5 pr-4">{event.title}</h3>
            
            <div className="flex gap-2">
              <button onClick={() => placeBet(event.id, 'yes')} className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-bold active:scale-95 transition shadow-lg shadow-gray-200">ДА</button>
              <button onClick={() => placeBet(event.id, 'no')} className="flex-1 bg-white border-2 border-gray-100 text-gray-900 py-4 rounded-2xl font-bold active:scale-95 transition">НЕТ</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;