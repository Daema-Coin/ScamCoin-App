<template>
  <div class="home-container">
    <header>
      <div class="header-content">
        <div class="logo"></div>
        <div class="balance">
          <div class="coin-container">
            <img src="@/assets/coin.png" alt="coin" />
            <span>{{ coin }}</span>
          </div>
          <div class="cart" @click="goToOrderPage">
            <img src="@/assets/cart.png" alt="cart" />
          </div>
        </div>
      </div>
    </header>
    <main>
      <div class="fixed-content">
        <div class="booth-info">
          <div class="booth-icon"></div>
          <div class="booth-name">{{ boothName }}</div>
        </div>
        <div class="search-bar">
          <input type="text" placeholder="검색어를 입력해주세요." />
        </div>
      </div>
      <div class="divider"></div>
      <div class="item-list">
        <div class="item" v-for="item in items" :key="item.id" :class="{ selected: isSelected(item) }"
          @click="toggleItem(item)">
          <div class="item-details">
            <p class="item-name">{{ item.name }}</p>
            <p class="item-price">{{ item.price }} 코인</p>
            <p class="item-description">{{ item.description }}</p>
          </div>
          <div class="item-image">
            <img :src="'https://jobis-store.s3.ap-northeast-2.amazonaws.com/' + item.image_url" alt="" />
          </div>
        </div>
      </div>
    </main>
    <transition name="show">
      <div v-if="selectedItems.length > 0" class="order-footer">
        <div class="order-background"></div>
        <button class="order-button" @click="goToOrderPage">{{ totalSelectedPrice }}코인 · 주문하기</button>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      items: [],
      selectedItems: [],
      booth_id: 3, // 임시로 설정한 부스 ID
      boothName: '',
      coin: 100000
    };
  },
  computed: {
    totalSelectedPrice() {
      return this.selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }
  },
  methods: {
    fetchMenu() {
      axios.get(`http://3.37.88.98:8000/menu/${this.booth_id}`)
        .then(response => {
          this.items = response.data.menu.map(item => ({
            ...item,
            quantity: 1 // quantity 필드 추가
          }));
          this.boothName = response.data.booth_name;
          this.syncSelectedItems();
        })
        .catch(error => {
          console.error('메뉴를 불러오는데 실패했습니다.', error);
        });
    },
    fetchCoin() {
      axios.get('http://3.37.88.98:8000/user/coin')
        .then(response => {
          this.coin = response.data.coin;
        })
        .catch(error => {
          console.error('잔여 코인을 불러오는데 실패했습니다.', error);
        });
    },
    isSelected(item) {
      return this.selectedItems.some(selected => selected.id === item.id);
    },
    toggleItem(item) {
      const selected = this.selectedItems.find(selected => selected.id === item.id);
      if (selected) {
        this.selectedItems = this.selectedItems.filter(selected => selected.id !== item.id);
      } else {
        this.selectedItems.push({ ...item, quantity: 1 });
      }
    },
    goToOrderPage() {
      this.$router.push({
        path: '/order',
        query: {
          selectedItems: JSON.stringify(this.selectedItems),
          coin: this.coin
        }
      });
    },
    syncSelectedItems() {
      if (this.$route.query.selectedItems) {
        const selectedItems = JSON.parse(this.$route.query.selectedItems);
        this.selectedItems = selectedItems.map(selected => {
          const item = this.items.find(item => item.id === selected.id);
          return item ? { ...item, quantity: selected.quantity } : selected;
        });
      }
    }
  },
  mounted() {
    this.fetchMenu();
    this.fetchCoin();
  }
};
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #fff;
}

.header-content {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}

.logo {
  width: 120px;
  height: 50px;
  background-image: url('@/assets/daedeok.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.balance {
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

.cart img {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.fixed-content {
  background-color: #fff;
  padding-bottom: 10px;
}

.booth-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
}

.booth-icon {
  width: 40px;
  height: 40px;
  background-image: url('@/assets/booth_logo.png');
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  margin-bottom: 10px;
}

.booth-name {
  font-size: 20px;
  font-weight: bold;
}

.search-bar {
  display: flex;
  justify-content: center;
}

.search-bar input {
  width: 100%;
  max-width: 400px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #f7f7f7;
  background-color: #f7f7f7;
}

.divider {
  height: 1px;
  background-color: #ccc;
  margin: 10px 0;
}

.item-list {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #cccccc;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: border-color 0.3s;
}

.item.selected {
  border: 2px solid #4285f4;
}

.item-details {
  display: flex;
  flex-direction: column;
  margin-right: 10px;
}

.item-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 2px;
}

.item-price {
  font-size: 14px;
  margin-bottom: 5px;
}

.item-description {
  font-size: 10px;
}

.item-image {
  margin-left: 10px;
}

.item-image img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
}

.order-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 97%;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px solid #cccccc;
  background-color: #fff;
  border-radius: 12px;
}

.order-background {
  width: 97%;
  height: 50px;
  background-color: white;
  border-radius: 12px;
}

.order-button {
  width: calc(100% - 20px);
  height: 45px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  text-align: center;
  padding-bottom: 10dp;
  margin-top: -30px;
}

.order-button:hover {
  background-color: #357ae8;
}

.up-down-enter-active,
.up-down-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.up-down-enter,
.up-down-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
