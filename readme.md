# Plan&Go

**Plan&Go**, kullanıcıların seyahatlerini kolay ve keyifli bir şekilde planlamasına olanak tanıyan bir web ve mobil uygulamadır. Uygulama, kullanıcı dostu arayüzü ve güçlü altyapısı sayesinde seyahat planlama sürecini daha verimli bir hale getirmeyi amaçlar.

## Özellikler
- Kişisel seyahat planları oluşturma ve düzenleme.
- Mobil ve web uyumlu tasarımıyla her yerde erişilebilirlik.

## Kullanılan Teknolojiler
- **Django**: Ölçeklenebilir ve güçlü backend geliştirme için kullanıldı.
- **Bootstrap**: Modern ve duyarlı bir kullanıcı arayüzü tasarımı sağlandı.
- **SQLite3**: Hafif ve güvenilir bir veritabanı çözümü olarak tercih edildi.

## Kurulum
1. Bu projeyi bilgisayarınıza klonlayın:
   ```bash
   git clone https://github.com/BEGithubRepo/Plan-and-Go.git

2. Sanal çalışma ortamı oluşturun:
    ```bash
    virtualenv .

3. Gerekli kütüphaneleri yükleyin:
    ```bash
   pip install -r requirements.txt

## Badges

### **1. Activity Tabanlı Rozetler**

**Activity Tabanlı Rozetler** kullanıcının uygulama üzerindeki belli hedeflere ulaşması ile elde edebileceği rozetlerin kazanılması için kullanılan servistir.
 
    {"id": 2, "type": "activity_based", "activity_type" : "comment" , "count": 5}

### **2. Event Tabanlı Rozetler**

**Event Tabanlı Rozetler** kullanıcının uygulama üzerinde gerçekleştireceği bir etkinlik ile elde edebileceği rozetlerin kazanılması için kullanılan servistir.

    {"id": 0, "type": "event_based", "event": "user_created"}

### 3. Özel Rozetler

**Özel Rozetler** kullanıcının uygulama üzerinde hedeflerle veya etkinliği ile elde edemeyeceği rozetlerin kazanılması için kullanılan servistir. Burada oluşturulan rozetler sınırlı sayıda kullanıcılara ve kullanıcının sınırlı sayıda elde edilebileceği şekilde modifiye imkanı tanımaktadır. 

    {"id": 1, "type": "profile_update" , "count" : 1}

## Projenin Başlatılması

### **Backend ve Web Sunucusu**

Web klasörü içerisinde yer alan **req.txt** dosyasında yazan kütüphanelerin yer aldığı bir virtualenv oluşturmalısınız. Oluşturduktan sonra aşağıdaki komut ile localhost üzerinden backend ve web sunucusu çalışmaya başlayacaktır.

    py manage.py runserver

### **Mobil Uygulama**

Mobil klasörü içerisinde yer alan **package.json** dosyasında yazan kütüphanelerin yer aldığı bir virtualenv oluşturmalısınız. Oluşturduktan sonra aşağıdaki komut ile localhost üzerinde mobil uygulama çalışmaya başlayacaktır.

    npx expo start