<template>
    <div class="order-container">
        <header class="order-header">
            <div class="header-left">
                <nuxt-link :to="{ path: '/home', query: { selectedItems: JSON.stringify(selectedItems), coin: coin } }">←
                    주문하기</nuxt-link>
            </div>
            <div class="header-right">
                <div class="coin-container">
                    <img src="@/assets/coin.png" alt="coin" />
                    <span>{{ coin }}</span>
                </div>
            </div>
        </header>
        <main class="order-main">
            <div class="item-list">
                <div class="item" v-for="item in selectedItems" :key="item.id">
                    <img :src="'https://jobis-store.s3.ap-northeast-2.amazonaws.com/' + item.image_url"
                        class="item-image" />
                    <div class="item-info">
                        <p class="item-name">{{ item.name }}</p>
                        <p class="item-price">{{ item.price }}코인</p>
                        <div class="item-quantity">
                            <button @click="removeItem(item)">삭제</button>
                            <button @click="decreaseQuantity(item)">-</button>
                            <span>{{ item.quantity }}</span>
                            <button @click="increaseQuantity(item)">+</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="request">
                <h3>요청사항</h3>
                <textarea placeholder="예) 견과류 빼주세요" v-model="request" maxlength="60"></textarea>
            </div>
        </main>
        <footer class="order-footer">
            <div class="total-amount">총 결제금액: {{ totalAmount }} 코인</div>
            <button class="pay-button" @click="pay">결제하기</button>
        </footer>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            selectedItems: [],
            coin: 0,
            request: '',
            booth_id: 3 // 임시로 설정한 부스 ID
        };
    },
    computed: {
        totalAmount() {
            return this.selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
        }
    },
    methods: {
        removeItem(item) {
            const index = this.selectedItems.indexOf(item);
            if (index > -1) {
                this.selectedItems.splice(index, 1);
            }
        },
        increaseQuantity(item) {
            item.quantity += 1;
        },
        decreaseQuantity(item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
            }
        },
        pay() {
            const orders = this.selectedItems.map(item => ({
                menu_id: item.id,
                amount: item.quantity
            }));
            const data = {
                orders: orders,
                request: this.request,
                price: this.totalAmount,
                booth_id: this.booth_id
            };
            axios.post('http://3.37.88.98:8000/order/', data)
                .then(response => {
                    alert('결제가 완료되었습니다!');
                    this.$router.push('/home');
                })
                .catch(error => {
                    console.error('결제에 실패했습니다.', error);
                    alert('결제에 실패했습니다. 다시 시도해주세요.');
                });
        }
    },
    mounted() {
        this.selectedItems = JSON.parse(this.$route.query.selectedItems);
        this.coin = Number(this.$route.query.coin);
    }
};
</script>
  
  
<style scoped>
.order-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.order-header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: #fff;
}

.header-left {
    display: flex;
    align-items: center;
}

.header-right {
    display: flex;
    align-items: center;
}

.coin-container {
    display: flex;
    align-items: center;
    background-color: #fff;
    border: 1px solid #3D8AFF;
    color: #3D8AFF;
    border-radius: 8px;
    padding: 5px 10px;
    margin-right: 10px;
}

.coin-container img {
    width: 24px;
    height: 24px;
    margin-right: 5px;
}

.order-main {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
}

.item-list {
    display: flex;
    flex-direction: column;
}

.item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid #ccc;
}

.item-image {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    margin-right: 10px;
}

.item-info {
    display: flex;
    flex-direction: column;
}

.item-name {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
}

.item-price {
    font-size: 14px;
    margin-bottom: 10px;
}

.item-quantity {
    display: flex;
    align-items: center;
}

.item-quantity button {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 5px;
    margin: 0 5px;
}

.request {
    margin-top: 20px;
}

.request h3 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
}

.request textarea {
    width: 100%;
    height: 60px;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    font-size: 14px;
    resize: none;
}

.order-footer {
    padding: 10px;
    background-color: #fff;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.total-amount {
    font-size: 16px;
    font-weight: bold;
}

.pay-button {
    background-color: #4285f4;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}
</style>
