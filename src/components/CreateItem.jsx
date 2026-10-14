import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useItemStore } from '../store/useItemStore'
import { api } from "../api/api"
import Input from './Input'

const CreateItem = () => {
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const getItems = useItemStore((state) => state.getItems)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        const title = e.target.title?.value
        const description = e.target.description?.value
        const price = e.target.price?.value
        const imageUrl = e.target.imageUrl?.value

        if (!title || !description || !price) {
            setError('Заполните все обязательные поля')
            return
        }

        const item = {
            title: title,
            description: description,
            price: Number(price),
        }

        if (imageUrl) {
            item.imageUrl = imageUrl
        }

        try {
            await api.sendItems(item)
            await getItems()
            navigate('/')
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка при создании товара'
            setError(errorMessage)
        }
    }

    return (
        <div className="container">
            <div className="page-header">
                <h1>Создать новый товар</h1>
            </div>

            <div className="form-container">
                <form id="create-item-form" onSubmit={handleSubmit}>
                    {error && <div className="alert alert-error active">{error}</div>}

                    <div className="form-group">
                        <label className="form-label">
                            Название товара <span className="required">*</span>
                        </label>
                        <Input
                            type="text"
                            className="form-input"
                            name="title"
                            placeholder="Например: iPhone 14 Pro 256GB"
                            maxLength="100"
                            required
                        />
                        <div className="char-counter">
                            <span className="current">0</span> / 100
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Описание <span className="required">*</span>
                        </label>
                        <textarea
                            className="form-textarea"
                            name="description"
                            placeholder="Подробно опишите товар..."
                            maxLength="1000"
                            required></textarea>
                        <div className="char-counter">
                            <span className="current">0</span> / 1000
                        </div>
                        <div className="form-hint">
                            Чем подробнее описание, тем больше шансов продать товар
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Начальная цена <span className="required">*</span>
                        </label>
                        <div className="input-group">
                            <Input
                                type="number"
                                className="form-input with-prefix"
                                name="price"
                                placeholder="5000"
                                min="1"
                                step="100"
                                required
                            />
                            <span className="input-prefix">₽</span>
                        </div>
                        <div className="form-hint">
                            Укажите минимальную цену, с которой начнутся торги
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">URL изображения</label>
                        <Input
                            type="url"
                            className="form-input"
                            name="imageUrl"
                            placeholder="https://example.com/image.jpg"
                        />
                        <div className="form-hint">
                            Вставьте ссылку на изображение товара (опционально)
                        </div>
                    </div>

                    <div className="form-actions">
                        <Link to="/" className="btn-cancel">
                            Отмена
                        </Link>
                        <button type="submit" className="btn-submit">
                            Создать товар
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateItem