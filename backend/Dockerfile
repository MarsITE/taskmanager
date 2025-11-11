FROM eclipse-temurin:24-jdk
VOLUME /tmp
COPY target/backend-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
