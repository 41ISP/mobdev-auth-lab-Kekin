import ItemCard from '../components/ItemCard'
import { useEffect, useState } from 'react'
import { useItemStore } from '../store/useItemStore'
import { useUserStore } from '../store/useUserStore'
import { api } from "../api/api"

const ItemsList = () => {
    const {items, getItems} = useItemStore()
    const [stats, setStats] = useState(null)

    useEffect(() => {
        getItems()
        const fetchStats = async () => {
            try {
                const data = await api.getStatus()
                setStats(data)
            }catch (error) {
                console.log('Ошибка при загрузке статистики:', error)
            }
        }

        fetchStats()
    }, [getItems])

    return (
        <div className="container">
            <div class="page-header">
                <h1>Все товары</h1>
            </div>
            <div class="stats">
                <div class="stat-item">
                    <span>Товаров: {stats?.totalItems ?? 0}</span>
                </div>
                <div class="stat-item">
                    <span>Ставок: {stats?.totalBids ?? 0}</span>
                </div>
                <div class="stat-item">
                   <span>Активных: {stats?.totalactiveItems ?? 0}</span>
                </div>
                <div class="stat-item">
                  <span>Средняя цена: {stats?.averageItemPrice ?? 0}</span>
                </div>
            </div>

            <div class="items-grid">
                {items.map((item, i) => (
                    <ItemCard key={i} {...item} />
                ))}
            </div>
        </div>
    )
}

export default ItemsList
