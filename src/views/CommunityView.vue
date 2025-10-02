<script setup>
import { ref } from 'vue'

const sharedItems = ref([
  {
    id: '1',
    foodName: 'Apples',
    quantity: '3 pieces',
    daysUntilExpiration: 2,
    distance: 0.3,
    sharedBy: 'Sarah Chen',
    avatar: 'SC',
    contact: {
      email: 'sarah.chen@email.com',
      phone: '+65 9123 4567',
      address: 'Blk 123 Ang Mo Kio Ave 3 #12-345'
    }
  },
  {
    id: '2',
    foodName: 'Milk',
    quantity: '1 liter',
    daysUntilExpiration: 1,
    distance: 0.7,
    sharedBy: 'Michael Tan',
    avatar: 'MT',
    contact: {
      email: 'michael.tan@email.com',
      phone: '+65 8234 5678',
      address: 'Blk 456 Tampines Ave 4 #08-123'
    }
  },
  {
    id: '3',
    foodName: 'Bread',
    quantity: '1 loaf',
    daysUntilExpiration: 3,
    distance: 1.2,
    sharedBy: 'Emily Wong',
    avatar: 'EW',
    contact: {
      email: 'emily.wong@email.com',
      phone: '+65 9345 6789',
      address: 'Blk 789 Jurong West St 24 #15-678'
    }
  }
])

const mySharedItems = ref([])
const showContactModal = ref(false)
const showShareModal = ref(false)
const selectedContact = ref(null)

// Share food form
const shareForm = ref({
  foodName: '',
  category: 'Fruits & Vegetables',
  quantity: 1,
  unit: 'pieces',
  expirationDate: '',
  pickupTime: '',
  notes: ''
})

const categories = [
  'Fruits & Vegetables',
  'Dairy & Eggs',
  'Meat & Poultry',
  'Bakery',
  'Snacks',
  'Beverages',
  'Condiments & Sauces',
  'Frozen Foods',
  'Grains & Pasta',
  'Other'
]

const units = ['pieces', 'kg', 'grams', 'liters', 'cups', 'servings', 'packs']

const handleContact = (item) => {
  selectedContact.value = item
  showContactModal.value = true
}

const handleShareFood = () => {
  // Reset form
  shareForm.value = {
    foodName: '',
    category: 'Fruits & Vegetables',
    quantity: 1,
    unit: 'pieces',
    expirationDate: '',
    pickupTime: '',
    notes: ''
  }
  showShareModal.value = true
}

const submitShare = () => {
  if (!shareForm.value.foodName || !shareForm.value.expirationDate) {
    alert('Please fill in all required fields')
    return
  }
  
  // Add to shared items
  const newItem = {
    id: Date.now().toString(),
    ...shareForm.value,
    sharedBy: 'You',
    avatar: 'YU',
    distance: 0,
    daysUntilExpiration: Math.ceil((new Date(shareForm.value.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  }
  
  mySharedItems.value.push(newItem)
  showShareModal.value = false
  alert('Food item shared successfully!')
}
</script>

<template>
  <div class="container-fluid p-4">
    <div class="mb-4">
      <h1 class="h2 mb-2">Community Food Sharing</h1>
      <p class="text-muted">Share expiring food with neighbors to reduce waste</p>
    </div>

    <div class="glass-card p-4 mb-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="h5 mb-0">My Shared Items</h3>
        <button class="btn btn-primary" @click="handleShareFood">
          <i class="bi bi-plus-lg me-2"></i> Share Food
        </button>
      </div>

      <div v-if="mySharedItems.length === 0" class="text-center py-4">
        <i class="bi bi-share fs-1 text-muted"></i>
        <p class="text-muted mt-3">You haven't shared any items yet</p>
      </div>
      
      <div v-else class="row g-3">
        <div
          v-for="item in mySharedItems"
          :key="item.id"
          class="col-12 col-md-6 col-lg-4"
        >
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title mb-2">{{ item.foodName }}</h5>
              <p class="text-muted mb-0">{{ item.quantity }} {{ item.unit }}</p>
              <span class="badge badge-warning-orange mt-2">
                Expires in {{ item.daysUntilExpiration }} day{{ item.daysUntilExpiration !== 1 ? 's' : '' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="glass-card p-4">
      <h3 class="h5 mb-4">Available Near You</h3>

      <div class="row g-4">
        <div
          v-for="item in sharedItems"
          :key="item.id"
          class="col-12 col-md-6 col-lg-4"
        >
          <div class="card h-100">
            <div class="card-body">
              <div class="mb-3">
                <h5 class="card-title mb-2">{{ item.foodName }}</h5>
                <p class="text-muted mb-0">{{ item.quantity }}</p>
              </div>

              <div class="mb-3">
                <span class="badge badge-warning-orange">
                  Expires in {{ item.daysUntilExpiration }} day{{ item.daysUntilExpiration !== 1 ? 's' : '' }}
                </span>
                <span class="badge bg-light text-dark ms-2">
                  <i class="bi bi-geo-alt"></i> {{ item.distance }} km away
                </span>
              </div>

              <div class="d-flex align-items-center gap-2 mb-3">
                <div class="avatar" style="width: 32px; height: 32px; font-size: 0.75rem;">
                  {{ item.avatar }}
                </div>
                <small class="text-muted">Shared by {{ item.sharedBy }}</small>
              </div>

              <button
                class="btn btn-primary w-100"
                @click="handleContact(item)"
              >
                <i class="bi bi-person-lines-fill me-2"></i>
                Contact {{ item.sharedBy.split(' ')[0] }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Modal -->
    <div v-if="showContactModal" class="modal fade show d-block" tabindex="-1" style="z-index: 1055;">
      <div class="modal-backdrop fade show" @click="showContactModal = false" style="z-index: 1050;"></div>
      <div class="modal-dialog modal-dialog-centered" style="z-index: 1060;">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-person-circle me-2"></i>
              Contact {{ selectedContact?.sharedBy }}
            </h5>
            <button type="button" class="btn-close" @click="showContactModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-4">
              <h6 class="fw-semibold">About this item:</h6>
              <p class="mb-1"><strong>{{ selectedContact?.foodName }}</strong> - {{ selectedContact?.quantity }}</p>
              <small class="text-muted">Expires in {{ selectedContact?.daysUntilExpiration }} day(s)</small>
            </div>
            
            <div class="mb-3">
              <h6 class="fw-semibold mb-3">Contact Information:</h6>
              
              <div class="mb-3">
                <div class="d-flex align-items-center gap-2 mb-1">
                  <i class="bi bi-envelope text-primary"></i>
                  <strong>Email:</strong>
                </div>
                <a :href="`mailto:${selectedContact?.contact.email}`" class="text-decoration-none">
                  {{ selectedContact?.contact.email }}
                </a>
              </div>
              
              <div class="mb-3">
                <div class="d-flex align-items-center gap-2 mb-1">
                  <i class="bi bi-telephone text-success"></i>
                  <strong>Phone:</strong>
                </div>
                <a :href="`tel:${selectedContact?.contact.phone}`" class="text-decoration-none">
                  {{ selectedContact?.contact.phone }}
                </a>
              </div>
              
              <div class="mb-3">
                <div class="d-flex align-items-center gap-2 mb-1">
                  <i class="bi bi-geo-alt text-danger"></i>
                  <strong>Address:</strong>
                </div>
                <p class="mb-0">{{ selectedContact?.contact.address }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showContactModal = false">
              Close
            </button>
            <a 
              :href="`mailto:${selectedContact?.contact.email}?subject=Food Request - ${selectedContact?.foodName}&body=Hi ${selectedContact?.sharedBy}, I'm interested in your ${selectedContact?.foodName}. Could we arrange a pickup?`"
              class="btn btn-primary"
            >
              <i class="bi bi-envelope me-2"></i>
              Send Email
            </a>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    </div>

    <!-- Share Food Modal -->
    <div v-if="showShareModal" class="modal fade show d-block" tabindex="-1" style="z-index: 1055;">
      <div class="modal-backdrop fade show" @click="showShareModal = false" style="z-index: 1050;"></div>
      <div class="modal-dialog modal-dialog-centered" style="z-index: 1060;">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-share me-2"></i>
              Share Food Item
            </h5>
            <button type="button" class="btn-close" @click="showShareModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitShare">
              <div class="mb-3">
                <label class="form-label">Food Name *</label>
                <input 
                  v-model="shareForm.foodName" 
                  type="text" 
                  class="form-control" 
                  placeholder="e.g., Apples, Milk, Bread"
                  required
                >
              </div>
              
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label">Category</label>
                  <select v-model="shareForm.category" class="form-select">
                    <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Expiration Date *</label>
                  <input 
                    v-model="shareForm.expirationDate" 
                    type="date" 
                    class="form-control"
                    :min="new Date().toISOString().split('T')[0]"
                    required
                  >
                </div>
              </div>
              
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label">Quantity</label>
                  <input 
                    v-model.number="shareForm.quantity" 
                    type="number" 
                    class="form-control"
                    min="1"
                    step="0.01"
                  >
                </div>
                <div class="col-md-6">
                  <label class="form-label">Unit</label>
                  <select v-model="shareForm.unit" class="form-select">
                    <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
                  </select>
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Preferred Pickup Time</label>
                <input 
                  v-model="shareForm.pickupTime" 
                  type="text" 
                  class="form-control"
                  placeholder="e.g., Weekdays after 6pm, Weekends anytime"
                >
              </div>
              
              <div class="mb-3">
                <label class="form-label">Additional Notes</label>
                <textarea 
                  v-model="shareForm.notes" 
                  class="form-control" 
                  rows="3"
                  placeholder="Any special instructions or notes about the food item..."
                ></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showShareModal = false">
              Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="submitShare">
              <i class="bi bi-share me-2"></i>
              Share Food
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Modal backdrop and positioning fixes */
.modal {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.modal-backdrop {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.modal-dialog {
  position: relative !important;
  margin: 1.75rem auto;
  pointer-events: auto;
  max-width: 500px;
}

.modal-content {
  position: relative;
  background: #fff;
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  pointer-events: auto;
}

/* Ensure modal appears above everything */
.modal.show {
  display: flex !important;
  align-items: center;
  justify-content: center;
}
</style>
