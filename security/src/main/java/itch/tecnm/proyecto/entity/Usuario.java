package itch.tecnm.proyecto.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Nombre de la persona (cliente o empleado, por ahora simple)
    @Column(nullable = false)
    private String nombre;

    // Rol: administrador, mesero, cliente, cajero, etc.
    @Column(nullable = false)
    private String perfil;

    // Autenticación
    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    // 1 = activo, 0 = inactivo
    @Column(nullable = false)
    private Integer estatus = 1;

    @Column(nullable = false)
    private LocalDate fechaRegistro;
    
 // ⭐ Se ejecuta antes de insertar en BD
    @PrePersist
    public void prePersist() {
        this.fechaRegistro = LocalDate.now();
    }
}
