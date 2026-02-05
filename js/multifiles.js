document.addEventListener('DOMContentLoaded', function() {
    // Находим все блоки загрузки файлов на странице
    const uploadFields = document.querySelectorAll('.js-field-file-multiple');
    
    uploadFields.forEach(uploadField => {
        const fileInput = uploadField.querySelector('.js-field-input');
        const attachButton = uploadField.querySelector('.js-file-button-attach');
        
        // Хранилище для файлов этого инпута
        let currentFiles = [];
        
        // Обработчик клика на кнопку "Выбрать файлы"
        attachButton.addEventListener('click', function(e) {
            e.preventDefault();
            fileInput.click();
        });
        
        // Обработчик изменения input file
        fileInput.addEventListener('change', function() {
            handleFiles(this.files, uploadField, fileInput);
        });
        
        // Обработчик drag and drop
        setupDragAndDrop(uploadField, fileInput);
    });
    
    // Обработчик удаления файлов (делегирование событий)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('button-file-del')) {
            e.preventDefault();
            const fileItem = e.target.closest('.frm-field-file');
            if (fileItem) {
                removeFileItem(fileItem);
            }
        }
    });
});

// Функция для обработки выбранных файлов
function handleFiles(files, uploadField, fileInput) {
    if (!files.length) return;
    
    // Создаем контейнер для файлов, если его еще нет
    let filesContainer = uploadField.nextElementSibling;
    if (!filesContainer || !filesContainer.classList.contains('uploaded-files-container')) {
        filesContainer = document.createElement('div');
        filesContainer.className = 'uploaded-files-container';
        uploadField.parentNode.insertBefore(filesContainer, uploadField.nextSibling);
    }
    
    // Добавляем каждый файл
    Array.from(files).forEach(file => {
        addFileItem(file, filesContainer, fileInput);
    });
    
    // Очищаем input (но файлы сохраняются в DataTransfer)
    fileInput.value = '';
}

// Функция для добавления элемента файла
function addFileItem(file, container, fileInput) {
    const fileSize = formatFileSize(file.size);
    const fileId = generateFileId();
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    const fileItem = document.createElement('div');
    fileItem.className = 'frm-field';
    fileItem.setAttribute('data-file-id', fileId);
    
    if (isImage || isVideo) {
        // Для фото и видео создаем элемент с превью
        fileItem.innerHTML = `
            <div class="frm-field-file type-att file-active">
                <div class="file-inner-wrap">
                    <div class="file-photo elm-photo photo-cover">
                        ${isImage ? `<img alt="${file.name}">` : ''}
                    </div>
                    <div class="file-name">${file.name} ${fileSize}</div>
                    <a href="#" class="btn-action-ico ico-trash button-file-del"></a>
                </div>
            </div>
        `;
        
        // Загружаем превью
        const imgContainer = fileItem.querySelector('.file-photo');
        if (isImage) {
            loadImagePreview(file, imgContainer);
        } else if (isVideo) {
            loadVideoPreview(file, imgContainer);
        }
    } else {
        // Для остальных файлов - обычный вид
        fileItem.innerHTML = `
            <div class="frm-field-file type-att file-active">
                <div class="file-inner-wrap">
                    <div class="file-name">${file.name} ${fileSize}</div>
                    <a href="#" class="btn-action-ico ico-trash button-file-del"></a>
                </div>
            </div>
        `;
    }
    
    container.appendChild(fileItem);
    
    // Сохраняем файл в input
    addFileToInput(file, fileInput, fileId);
}

// Функция для загрузки превью изображения
function loadImagePreview(file, container) {
    const reader = new FileReader();
    const img = container.querySelector('img');
    
    reader.onload = function(e) {
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

// Функция для загрузки превью видео
function loadVideoPreview(file, container) {
    // Создаем видео элемент для получения превью
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = function() {
        // Создаем canvas для создания скриншота
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Устанавливаем размеры canvas как у видео
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Делаем скриншот на первой секунде
        video.currentTime = 1;
    };
    
    video.oncanplay = function() {
        // Когда видео готово к воспроизведению, пытаемся сделать скриншот
        setTimeout(() => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Создаем изображение из canvas
                const img = document.createElement('img');
                img.src = canvas.toDataURL('image/jpeg', 0.8);
                img.alt = file.name;
                container.appendChild(img);
                
                // Добавляем иконку видео
                const videoIcon = document.createElement('div');
                videoIcon.className = 'video-icon';
                videoIcon.innerHTML = '<i class="fas fa-play"></i>';
                container.appendChild(videoIcon);
            } catch (error) {
                console.error('Ошибка при создании превью видео:', error);
                // Если не удалось создать превью, показываем иконку видео
                showVideoIcon(container, file.name);
            }
        }, 500);
    };
    
    // Обработка ошибок
    video.onerror = function() {
        showVideoIcon(container, file.name);
    };
    
    // Читаем видео как URL для получения метаданных
    const url = URL.createObjectURL(file);
    video.src = url;
    
    // Освобождаем URL через 30 секунд
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 30000);
}

// Функция для отображения иконки видео при ошибках
function showVideoIcon(container, fileName) {
    container.innerHTML = `
        <div class="file-default-icon">
            <i class="fas fa-file-video"></i>
        </div>
    `;
}


// Функция для удаления элемента файла
function removeFileItem(fileItem) {
    const fileField = fileItem.closest('.frm-field');
    const fileId = fileField.getAttribute('data-file-id');
    const uploadField = fileField.parentElement.previousElementSibling;
    const fileInput = uploadField.querySelector('.js-field-input');
    
    // Удаляем файл из input
    removeFileFromInput(fileId, fileInput);
    
    // Удаляем визуальный элемент
    fileField.remove();
    
    // Если контейнер пуст, удаляем его
    const filesContainer = fileField.parentElement;
    if (filesContainer.children.length === 0) {
        filesContainer.remove();
    }
}

// Функция для добавления файла в input
function addFileToInput(file, fileInput, fileId) {
    // Получаем текущий DataTransfer
    const dataTransfer = new DataTransfer();
    
    // Добавляем существующие файлы
    const currentFiles = Array.from(fileInput.files || []);
    currentFiles.forEach(existingFile => {
        dataTransfer.items.add(existingFile);
    });
    
    // Добавляем новый файл
    dataTransfer.items.add(file);
    
    // Сохраняем файл в кастомном хранилище
    if (!fileInput._fileStorage) {
        fileInput._fileStorage = new Map();
    }
    fileInput._fileStorage.set(fileId, file);
    
    // Обновляем files в input
    fileInput.files = dataTransfer.files;
    
    console.log('Файлы в input:', fileInput.files.length);
}

// Функция для удаления файла из input
function removeFileFromInput(fileId, fileInput) {
    const dataTransfer = new DataTransfer();
    
    // Удаляем из кастомного хранилища
    if (fileInput._fileStorage) {
        fileInput._fileStorage.delete(fileId);
    }
    
    // Пересоздаем FileList из оставшихся файлов
    if (fileInput._fileStorage) {
        fileInput._fileStorage.forEach(file => {
            dataTransfer.items.add(file);
        });
    }
    
    // Обновляем files в input
    fileInput.files = dataTransfer.files;
    
    console.log('Файлы в input после удаления:', fileInput.files.length);
}

// Функция для генерации уникального ID файла
function generateFileId() {
    return 'file_' + Math.random().toString(36).substr(2, 9);
}

// Функция для форматирования размера файла
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Б';
    
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function generateFileId() {
    return 'file_' + Math.random().toString(36).substr(2, 9);
}

// Функция для настройки drag and drop
function setupDragAndDrop(uploadField, fileInput) {
    // Предотвращаем стандартное поведение браузера
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadField.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Подсветка области при перетаскивании
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadField.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadField.addEventListener(eventName, unhighlight, false);
    });
    
    // Обработка drop
    uploadField.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files, uploadField, fileInput);
    }, false);
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        uploadField.classList.add('highlight');
    }
    
    function unhighlight() {
        uploadField.classList.remove('highlight');
    }
}