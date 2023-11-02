<template>
    <base-dialog :isDialogOpen="isDialogVisible" title="You must select an image to continue." @close="closeDialog"
        :showSecondaryButton="false">
    </base-dialog>
    <div class="backdrop" @click="close" v-show="showGallery"></div>
    <Transition name="gallery">
        <div class="container" v-show="showGallery">
            <h1 class="lead text-center mt-2 text-color mb-2">Select an Image</h1>
            <div class="gallery row py-3 align-items-center justify-content-center gap-3">
                <button type="button" v-for="image in allImagesName" :key="image.name" :id="image.name" :ref="image.name"
                    :class="['image-content', 'btn', 'col', 'col-6', 'col-md-4', 'col-lg-3', { 'selected': image.isActive }]"
                    @click="selectImage($event)" :style="'background-position:' + image.position" tabindex="1"></button>
            </div>
            <div class="row align-items-center justify-content-center gap-3 mt-4 mb-3">
                <base-button type="button" class=" col" @click="verifySelectedImage" tabindex="1">Confirm</base-button>
                <base-button type="button" class="col" :secondaryButton="true" @click="close"
                    tabindex="1">Close</base-button>
            </div>
        </div>
    </Transition>
</template>
<script>
export default {
    props: ['preSelectedImage', 'showGallery'],
    emits: ['close', 'image'],
    data() {
        return {
            allImagesName: [
                {
                    name: 'albert',
                    position: 'center',
                    isActive: false
                },
                {
                    name: 'anatomy',
                    position: 'center top',
                    isActive: false
                },
                {
                    name: 'astronomy',
                    position: 'center 40%',
                    isActive: false
                },
                {
                    name: 'biology',
                    position: 'center 40%',
                    isActive: false
                },
                {
                    name: 'cinema',
                    position: 'center 60%',
                    isActive: false
                },
                {
                    name: 'math',
                    position: 'center',
                    isActive: false
                },
                {
                    name: 'mathematic',
                    position: 'center 10%',
                    isActive: false
                },
                {
                    name: 'philosophy',
                    position: 'center top',
                    isActive: false
                },
                {
                    name: 'technology',
                    position: 'center',
                    isActive: false
                },
                {
                    name: 'telescope',
                    position: 'center',
                    isActive: false
                }
            ],
            selectedImage: '',
            imagePosition: '',
            isDialogVisible: false,
            show: true
        }
    },
    mounted() {
        if (this.preSelectedImage !== '') {
            const elementInList = this.allImagesName.find(item => item.name === this.preSelectedImage)
            elementInList.isActive = true
            this.selectedImage = this.preSelectedImage
        }
        this.$refs.albert[0].focus()

    },
    methods: {
        closeDialog() {
            this.isDialogVisible = false

        },
        close() {
            this.show = false
            this.$emit('close')
        },
        selectImage(event) {
            const element = event.target, currentElement = this.allImagesName.find(item => item.name === element.id)
            let updateValue = true

            if (currentElement.isActive) {
                updateValue = false
            }
            this.allImagesName.forEach(elementFromList => {
                elementFromList.isActive = false
            })

            if (updateValue) {
                currentElement.isActive = true
                this.selectedImage = currentElement.name
                this.imagePosition = currentElement.position
            } else {
                this.selectedImage = ''
                this.imagePosition = ''
            }

        },
        verifySelectedImage() {
            if (this.selectedImage !== '') {
                this.sendSelectedImage()
                this.close()
            } else {
                this.isDialogVisible = true
            }
        },
        sendSelectedImage() {
            this.$emit('image', this.selectedImage, this.imagePosition)
        }
    }
}
</script>

<style scoped>
.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, .85);
    z-index: 99;
    transition: .3s ease;
}

h1.lead {
    font-weight: 700;
    font-size: 2.4rem;
}

.container {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 1rem 2rem;
    width: 90vw;
    max-width: 800px;
    max-height: 90%;
    background-color: var(--secondary-background-color);
    border: none;
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 1px, rgba(0, 0, 0, 0.07) 0px 2px 2px, rgba(0, 0, 0, 0.07) 0px 4px 4px, rgba(0, 0, 0, 0.07) 0px 8px 8px, rgba(0, 0, 0, 0.07) 0px 16px 16px;
    z-index: 999;
}

.gallery {
    padding: 0 .7rem;
    height: 500px !important;
    overflow-y: auto !important;
}

.image-content {
    padding: 0;
    margin: .1rem 0;
    width: 150px;
    aspect-ratio: 1/1;
    object-fit: cover;
    border-radius: 4px;
    transition: transform .3s ease-out, scale 350ms, filter .2s linear;
}

.image-content:active {
    transform: scale(.85);
}

.image-content:focus-visible {
    box-shadow: 0px 0px 20px 4px var(--accent-color);
    outline: 2px solid var(--accent-color);
}

.gallery:has(.image-content:hover) .image-content:not(:hover) {
    filter: brightness(.8);
}

.image-content:hover {
    scale: 1.1;
}

.image-content.selected {
    border: 3.5px solid var(--accent-color);
}

::-webkit-scrollbar {
    width: 12px;
}

::-webkit-scrollbar-thumb {
    background-color: #111111;
    border-radius: 5px;
    transition: all .3s ease-out;
}

::-webkit-scrollbar:hover {
    width: 16px;
}

::-webkit-scrollbar-thumb:hover {
    background-color: #0d0d0d;
}

#astronomy {
    background-image: url('../../assets/astronomy.jpeg');
    background-size: cover;
    background-repeat: no-repeat
}

#math {
    background-image: url('../../assets/math.jpeg');
    background-size: cover;
    background-repeat: no-repeat;
}

#mathematic {
    background-image: url('../../assets/mathematic.jpeg');
    background-size: cover;
    background-repeat: no-repeat;
}

#telescope {
    background-image: url('../../assets/telescope.jpeg');
    background-size: cover;
    background-repeat: no-repeat;
}

#technology {
    background-image: url('../../assets/technology.jpeg');
    background-size: cover;
    background-repeat: no-repeat;
}

#philosophy {
    background-image: url('../../assets/philosophy.jpeg');
    background-size: cover;
    background-repeat: no-repeat;
}

#cinema {
    background-image: url('../../assets/cinema.jpeg');
    background-size: cover;
    background-repeat: no-repeat;
}

#biology {
    background-image: url('../../assets/biology.jpeg');
    background-size: cover;
    background-repeat: no-repeat;
}

#anatomy {
    background-image: url('../../assets/anatomy.jpeg');
    background-size: cover;
    background-repeat: no-repeat;
}

#albert {
    background-image: url('../../assets/albert.jpeg');
    background-size: cover;
    background-repeat: no-repeat;
}



.gallery-enter-active {
    animation: fade .4s ease-out;
}

.gallery-leave-active {
    animation: fade .3s ease-out reverse;
}

@media (hover:none) {
    .gallery:has(.image-content:hover) .image-content:not(:hover) {
        filter: brightness(1) !important;
    }

    .image-content:hover {
        scale: 1 !important;
    }
}
</style>